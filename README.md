# Solana Vote DApp (Anchor)

A decentralized voting application built on **Solana** using the **Anchor framework**. This program supports proposal creation, voting, treasury initialization, token minting, and winner declaration, with clear on-chain state separation and event emission.

---

## Project Structure

```
programs/solana_vote_dapp/src/
├── lib.rs        # Program entrypoint & instruction handlers
├── contexts.rs   # Account validation & instruction contexts
├── state.rs      # Persistent on-chain state accounts
├── events.rs     # Program events (logs)
└── errors.rs     # Custom error definitions
```

---

## Core Concepts

* **Treasury-backed voting**: A treasury is initialized with its own mint (`x_mint`) and token account.
* **Proposal-based governance**: Users can create proposals and vote within a deadline.
* **On-chain accounting**: All proposals, voters, counters, and winners are stored as program accounts.
* **Event-driven**: Key actions emit events for off-chain indexing.

---

## Instructions

### 1. Initialize Treasury

Initializes the core treasury configuration, mint, and counters.

**Instruction**: `initialize_treasury`

**Accounts**:

* `authority` – Program admin
* `treasury_config_account` – Stores treasury config
* `x_mint` – SPL token mint for voting tokens
* `treasury_token_account` – ATA holding minted tokens
* `proposal_counter_account` – Tracks proposal IDs
* `sol_vault` – PDA to receive SOL
* `mint_authority` – PDA mint authority

**Parameters**:

* `sol_price: u64` – Price of tokens in SOL
* `tokens_per_purchase: u64` – Tokens minted per purchase

---

### 2. Buy Tokens *(WIP)*

Allows users to buy voting tokens by transferring SOL to the vault and receiving `x_mint` tokens.

**Instruction**: `buy_tokens`

> Logic partially implemented. Expected flow:
>
> 1. Transfer SOL from buyer → vault
> 2. Mint `x_mint` tokens to buyer

---

## On-Chain State Accounts

### `TreasuryConfig`

Stores global treasury configuration.

| Field                  | Type   | Description              |
| ---------------------- | ------ | ------------------------ |
| authority              | Pubkey | Treasury admin           |
| x_mint                 | Pubkey | Voting token mint        |
| treasury_token_account | Pubkey | Treasury ATA             |
| sol_price              | u64    | Price per token purchase |
| tokens_per_purchase    | u64    | Tokens minted per buy    |
| bump                   | u8     | PDA bump                 |

---

### `Proposal`

Represents a voting proposal.

| Field           | Type         | Description                      |
| --------------- | ------------ | -------------------------------- |
| proposal_id     | u8           | Unique ID                        |
| number_of_votes | u8           | Votes count                      |
| deadline        | i64          | Voting deadline (unix timestamp) |
| proposal_info   | String (≤50) | Proposal description             |
| authority       | Pubkey       | Creator                          |

---

### `Voter`

Tracks individual voter participation.

| Field          | Type   | Description       |
| -------------- | ------ | ----------------- |
| voter_id       | Pubkey | Voter address     |
| proposal_voted | u8     | Proposal ID voted |

---

### `ProposalCounter`

Maintains incremental proposal IDs.

| Field          | Type   | Description            |
| -------------- | ------ | ---------------------- |
| authority      | Pubkey | Admin                  |
| proposal_count | u8     | Current proposal count |

---

### `Winner`

Stores the winning proposal after voting ends.

| Field               | Type         | Description   |
| ------------------- | ------------ | ------------- |
| winning_proposal_id | u8           | Winner ID     |
| winning_votes       | u8           | Vote count    |
| proposal_info       | String (≤50) | Proposal text |
| declared_at         | i64          | Timestamp     |

---

## Events

Emitted for off-chain consumers and indexers.

* **`ProposalCreated`** – On proposal creation
* **`VoterAccountClosed`** – When voter account is closed and rent recovered
* **`SolWithdrawn`** – When SOL is withdrawn from treasury

---

## Error Codes

### Voting Errors

* `InvalidDeadline`
* `ProposalEnded`
* `ProposalNotEnded`
* `NoVotesCast`
* `VotingStillActive`
* `UnAuthorized`

### Proposal Errors

* `ProposalAlreadyExists`

### Counter Errors

* `CounterOverflow`

---

## Tech Stack

* **Solana**
* **Anchor Framework**
* **SPL Token / Associated Token Program**

---

## Security & Audit Notes

* PDA seeds are used consistently for treasury, mint authority, and vaults
* Proposal counter overflow is guarded
* Authority checks enforced via stored pubkeys
* Deadlines are validated using on-chain timestamps


