use anchor_lang::prelude::*;
mod contexts;
mod state;
use contexts::*;
mod events;
use events::*;

declare_id!("5cFKyhGgxH6apLqGn7sc3Jmmtb2vsBbazs3AK6GbFJGi");
use anchor_spl::token::{mint_to, MintTo, transfer, Transfer};
use anchor_lang::system_program;
mod errors;
use errors::{VotingErrorCode, ProposalErrorCode, CounterErrorCode};



#[program]
pub mod solana_vote_dapp {
    use super::*;

    pub fn initialize_treasury(ctx: Context<InitializeTreasury>, _sol_price: u64, _tokens_per_purchase: u64) -> Result<()> {
        let treasury_config_account = &mut ctx.accounts.treasury_config_account;
        treasury_config_account.authority = ctx.accounts.authority.key();
        treasury_config_account.bump = ctx.bumps.sol_vault;
        treasury_config_account.sol_price = _sol_price;
        treasury_config_account.x_mint = ctx.accounts.x_mint.key();
        treasury_config_account.tokens_per_purchase = _tokens_per_purchase;
        treasury_config_account.treasury_token_account = ctx.accounts.treasury_token_account.key();
        let proposal_counter_account = &mut ctx.accounts.proposal_counter_account;
        require!(proposal_counter_account.proposal_count == 0, ProposalErrorCode::ProposalAlreadyExists);
        proposal_counter_account.proposal_count = 1 ;
        proposal_counter_account.authority = ctx.accounts.authority.key();
        Ok(())
    }

    pub fn buy_tokens(ctx: Context<BuyTokens>) -> Result<()>{
        //1. buyer will transfer sol from buyer  to sol vault
        let treasury_config_account = &mut ctx.accounts.treasury_config_account;
        let sol = treasury_config_account.sol_price;
        let token_amount = treasury_config_account.tokens_per_purchase;
        let transfer_ix = anchor_lang::system_program::Transfer{
            from:ctx.accounts.buyer.to_account_info(),
            to:ctx.accounts.sol_vault.to_account_info(),
        };
        system_program::transfer(
            CpiContext::new(ctx.accounts.system_program.to_account_info(), transfer_ix),
            sol,
        )?;
          
        //2. mint tokens to buyer_token_account
        let mint_authority_seeds = &[b"mint_authority".as_ref(), &[ctx.bumps.mint_authority]];
        let signer_seeds = &[&mint_authority_seeds[..]];

        let cpi_accounts = MintTo{
            mint:ctx.accounts.x_mint.to_account_info(),
            to:ctx.accounts.buyer_token_account.to_account_info(),
            authority:ctx.accounts.mint_authority.to_account_info(),
        };

        let cpi_ctx  = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        //3. X mint token
        mint_to(cpi_ctx, token_amount)?;        

        Ok(())

    }

    //Register a voter
    pub fn register_voter(ctx: Context<RegisterVoter>) -> Result<()> {
        let voter_account = &mut ctx.accounts.voter_account;
        voter_account.voter_id = ctx.accounts.authority.key();
         
        Ok(())
    }

    //Register a proposal
    pub fn register_proposal(ctx: Context<RegisterProposal>, proposal_info:String, _deadline:i64, token_amount: u64  ) -> Result<()> {
        let clock = Clock::get()?; 
        require!(_deadline > clock.unix_timestamp, VotingErrorCode::InvalidDeadline);
        let proposal_account = &mut ctx.accounts.proposal_account;
        //transfer tokens from proposal_token account to treasury token account
        let cpi_accounts = Transfer{
            from: ctx.accounts.proposal_token_account.to_account_info(),
            to: ctx.accounts.treasury_token_account.to_account_info(),
            authority:ctx.accounts.authority.to_account_info()
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
        );
        //transfer tokens from proposal_token account to treasury token account
        transfer(cpi_ctx, token_amount)?;
        proposal_account.proposal_info = proposal_info;
        proposal_account.deadline = _deadline;
        proposal_account.authority = ctx.accounts.authority.key();

        let proposal_counter_account = &mut ctx.accounts.proposal_counter_account;
        proposal_account.proposal_id = proposal_counter_account.proposal_count;

        proposal_counter_account.proposal_count = proposal_counter_account.proposal_count.checked_add(1).ok_or(CounterErrorCode::CounterOverflow)?;

        emit!(ProposalCreated {
            proposal_id: proposal_account.proposal_id,
            creator:        proposal_account.authority,
            proposal_info:         proposal_account.proposal_info.clone(),
            deadline: _deadline,
            timestamp: clock.unix_timestamp,
        });



         
        Ok(())
    }

    //Cast a vote
    pub fn proposal_to_vote(ctx: Context<Vote>, proposal_id:u8,  token_amount: u64  ) -> Result<()> {
        
        let clock = Clock::get()?; 
        let proposal_account = &mut ctx.accounts.proposal_account;

        require!(proposal_account.deadline > clock.unix_timestamp, VotingErrorCode::ProposalEnded);

        //transfer tokens from voter token account to treasury token account
        let cpi_accounts = Transfer{
            from: ctx.accounts.voter_token_account.to_account_info(),
            to: ctx.accounts.treasury_token_account.to_account_info(),
            authority:ctx.accounts.authority.to_account_info()
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
        );
        //transfer tokens from proposal_token account to treasury token account
        transfer(cpi_ctx, token_amount)?;


        let voter_account  = &mut ctx.accounts.voter_account;
        voter_account.proposal_voted = proposal_id;

        proposal_account.number_of_votes = proposal_account.number_of_votes.checked_add(1).ok_or(CounterErrorCode::CounterOverflow)?; 
         
        Ok(())
    }

    //Pick a winner
    pub fn pick_winner(ctx: Context<PickWinner>, proposal_id: u8)-> Result<()> {
        let clock = Clock::get()?;
        let proposal = &ctx.accounts.proposal_account;
        let winner = &mut ctx.accounts.winner_account;

        //ensure voting period has ended
        require!(clock.unix_timestamp >= proposal.deadline, VotingErrorCode::VotingStillActive);

        //Check if this proposal has any votes
        require!(proposal.number_of_votes > 0, VotingErrorCode:: NoVotesCast);

        //update winner if this proposal has  more votes (or if no winner yer)
        if proposal.number_of_votes > winner.winning_votes{
            winner.winning_proposal_id = proposal_id;
            winner.winning_votes = proposal.number_of_votes;
            winner.proposal_info = proposal.proposal_info.clone();
            winner.declared_at = clock.unix_timestamp;
        }

        



        Ok(())
    }

    //Close a proposal
    pub fn close_proposal(ctx: Context<CloseProposal>, _proposal_id: u8) -> Result<()>{
        let clock = Clock::get()?;
        let proposal = &ctx.accounts.proposal_account;
        //Can only close after voting ends
        require!(
            clock.unix_timestamp >= proposal.deadline, VotingErrorCode::VotingStillActive
        );
        //Account will be closed by the 'close' constraint

        Ok(())
    }

    //Close a voter
    pub fn close_voter(ctx: Context<CloseVoter>) -> Result<()>{
       emit!(VoterAccountClosed{
        voter: ctx.accounts.voter_account.voter_id,
        rent_recovered_to: ctx.accounts.authority.key(),
        timestamp: Clock::get()?.unix_timestamp,
       });
        //Account will be closed by the 'close' constraint

        Ok(())
    }

    //Withdraw SOL from the treasury
    pub fn withdraw_sol(ctx: Context<WithdrawSol>, amount : u64) -> Result<()>{
        let treasury_config =&ctx.accounts.treasury_config;
        // Use PDA signing to transfer SOL from vault to authority
        let sol_vault_seeds = &[b"sol_vault".as_ref(), &[treasury_config.bump]];
        let signer_seeds = &[&sol_vault_seeds[..]];

        let transfer_ix = system_program::Transfer{
            from : ctx.accounts.sol_vault.to_account_info(),
            to: ctx.accounts.authority.to_account_info(),

        };
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                transfer_ix,
                signer_seeds,
            ),
            amount
        )?;

        emit!(SolWithdrawn{
            authority: ctx.accounts.authority.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });


        Ok(())
    }



}
 