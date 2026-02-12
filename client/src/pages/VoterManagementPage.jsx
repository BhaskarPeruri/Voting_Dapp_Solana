import VoterInfo from "../components/VoterInfo";
import RegisterVoter from "../components/RegisterVoter";
import CloseVoter from "../components/CloseVoter";
import AllProposals from "../components/AllProposals";
import "./VoterManagementPage.css";

function VoterManagementPage({ walletAddress, idlWithAddress, getProvider }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 Voter Management</h1>
        <p>Register as a voter and manage your voting status</p>
      </div>

      <div className="page-content">
        <section className="page-section">
          <h2 className="section-title">Your Voter Status</h2>
          <div className="cards-grid">
            <VoterInfo
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
            />
            <RegisterVoter
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
            />
            <CloseVoter
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
            />
          </div>
        </section>

        <section className="page-section">
          <h2 className="section-title">📋 Active Proposals</h2>
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

export default VoterManagementPage;
