import TokenBalance from "../components/TokenBalance";
import BuyTokens from "../components/BuyTokens";
import AllProposals from "../components/AllProposals";
import "./TokensPage.css";

function TokensPage({
  walletAddress,
  idlWithAddress,
  getProvider,
  connection,
}) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🪙 Token Management</h1>
        <p>Buy tokens and manage your voting power</p>
      </div>

      <div className="page-content">
        <section className="page-section">
          <h2 className="section-title">Your Tokens</h2>
          <div className="cards-grid">
            <TokenBalance
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
              connection={connection}
            />
            <BuyTokens
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
              connection={connection}
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

export default TokensPage;
