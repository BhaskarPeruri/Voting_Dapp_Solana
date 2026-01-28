use anchor_lang::prelude::*;

#[error_code]
pub enum VotingErrorCode {
    #[msg("Invalid deadline")]
    InvalidDeadline,

    #[msg("Proposal Ended")]
    ProposalEnded,

    #[msg("Proposal not ended")]
    ProposalNotEnded,

    #[msg("No votes cast")]
    NoVotesCast,
    
    #[msg("Voting still active")]
    VotingStillActive,

    #[msg("UnAuthorized")]
    UnAuthorized
}

#[error_code]
pub enum ProposalErrorCode {
    #[msg("Proposal already exists")]
    ProposalAlreadyExists,
}

#[error_code]
pub enum CounterErrorCode {
    #[msg("Counter overflow")]
    CounterOverflow,
}
