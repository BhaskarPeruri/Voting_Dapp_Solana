import RegisterProposal from "../components/RegisterProposal";
import ProposalInfo from "../components/ProposalInfo";
import Vote from "../components/Vote";
import PickWinner from "../components/PickWinner";
import CloseProposal from "../components/CloseProposal";
import AllProposals from "../components/AllProposals";
import "./ProposalActionsPage.css";

function ProposalActionsPage({ walletAddress, idlWithAddress, getProvider }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📋 Proposal Actions</h1>
        <p>Create proposals, vote, and manage governance</p>
      </div>

      <div className="page-content">
        <section className="page-section">
          <h2 className="section-title">Proposal Management</h2>
          <div className="cards-grid">
            <RegisterProposal
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
            />
            <ProposalInfo
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
            />
            <Vote
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
            />
            <PickWinner
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
            />
            <CloseProposal
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
            />
          </div>
        </section>

        <section className="page-section">
          <h2 className="section-title">📋 All Proposals</h2>
          <div className="cards-grid">
            <AllProposals
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProposalActionsPage;
