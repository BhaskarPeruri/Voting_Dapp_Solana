import { useState } from "react";
import InitializeTreasury from "../components/InitializeTreasury";
import WithdrawSol from "../components/WithdrawSol";
import TreasuryInfo from "../components/TreasuryInfo";
import "./AdminPage.css";

function AdminPage({
  walletAddress,
  idlWithAddress,
  getProvider,
  isAdminAuthorized,
  setIsAdminAuthorized,
}) {
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const verifyAdminPassword = () => {
    if (adminPassword === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAdminAuthorized(true);
      setAdminPassword("");
      setAdminError("");
    } else {
      setAdminError("Invalid admin password");
      setAdminPassword("");
    }
  };

  const handleSignOut = () => {
    setIsAdminAuthorized(false);
    setAdminPassword("");
    setAdminError("");
  };

  if (!isAdminAuthorized) {
    return (
      <div className="page-container">
        <div className="admin-auth-container">
          <div className="admin-auth-card">
            <div className="auth-icon">🔐</div>
            <h2>Admin Access Required</h2>
            <p>This section is protected. Please enter your admin password to continue.</p>

            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && verifyAdminPassword()}
              className="auth-input"
            />

            {adminError && <p className="auth-error">{adminError}</p>}

            <button className="auth-btn" onClick={verifyAdminPassword}>
              Unlock Admin Panel
            </button>

            <p className="auth-hint">🔑 Hint: Consider the original phrase and add complexity</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header admin-header">
        <div>
          <h1>⚙️ Admin Panel</h1>
          <p>Treasury management and system controls</p>
        </div>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <div className="page-content">
        <section className="page-section">
          <h2 className="section-title">Treasury Controls</h2>
          <p className="section-description">
            Only authorized admins can perform these critical operations.
          </p>
          <div className="cards-grid">
            <InitializeTreasury
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
            />
            <WithdrawSol
              walletAddress={walletAddress}
              idlWithAddress={idlWithAddress}
              getProvider={getProvider}
            />
          </div>
        </section>

        <section className="page-section">
          <h2 className="section-title">🏦 Treasury Information</h2>
          <div className="cards-grid">
            <TreasuryInfo
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

export default AdminPage;
