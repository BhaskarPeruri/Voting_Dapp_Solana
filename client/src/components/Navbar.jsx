import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({
  walletAddress,
  onConnectWallet,
  loading,
  isAdminAuthorized,
  onLogoutAdmin,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (isAdminAuthorized) {
      navigate("/admin");
    } else {
      navigate("/admin");
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <button className="brand-button" onClick={() => handleNavClick("/")}>
            <span className="brand-icon">🗳️</span>
            <span className="brand-text">Vote dApp</span>
          </button>
        </div>

        <div className={`navbar-menu ${mobileMenuOpen ? "active" : ""}`}>
          <button
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => handleNavClick("/")}
          >
            Home
          </button>

          {walletAddress && (
            <>
              <button
                className={`nav-link ${isActive("/tokens") ? "active" : ""}`}
                onClick={() => handleNavClick("/tokens")}
              >
                💰 Tokens
              </button>

              <button
                className={`nav-link ${isActive("/voter") ? "active" : ""}`}
                onClick={() => handleNavClick("/voter")}
              >
                👤 Voter
              </button>

              <button
                className={`nav-link ${isActive("/proposals") ? "active" : ""}`}
                onClick={() => handleNavClick("/proposals")}
              >
                📋 Proposals
              </button>

              <button
                className={`nav-link ${
                  isAdminAuthorized ? "admin-active" : ""
                } ${isActive("/admin") ? "active" : ""}`}
                onClick={handleAdminClick}
              >
                ⚙️ Admin{" "}
                {isAdminAuthorized && <span className="admin-badge">✓</span>}
              </button>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {walletAddress && (
            <span className="wallet-badge" title={walletAddress}>
              {shortenAddress(walletAddress)}
            </span>
          )}

          <button
            className="connect-btn"
            onClick={onConnectWallet}
            disabled={loading}
          >
            {loading
              ? "Connecting..."
              : walletAddress
                ? "Connected"
                : "Connect Wallet"}
          </button>

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
