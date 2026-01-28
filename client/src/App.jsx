import { useState } from "react";
import idl from "./idl/idl.json";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider } from "@coral-xyz/anchor";

import InitializeTreasury from "./components/InitializeTreasury";
import BuyTokens from "./components/BuyTokens";
import RegisterVoter from "./components/RegisterVoter";
import RegisterProposal from "./components/RegisterProposal";
import Vote from "./components/Vote";
import PickWinner from "./components/PickWinner";
import WithdrawSol from "./components/WithdrawSol";
import CloseProposal from "./components/CloseProposal";
import CloseVoter from "./components/CloseVoter";
import TokenBalance from "./components/TokenBalance";
import VoterInfo from "./components/VoterInfo";
import ProposalInfo from "./components/ProposalInfo";
import AllProposals from "./components/AllProposals";
import TreasuryInfo from "./components/TreasuryInfo";

import "./App.css";

const programID = new PublicKey(idl.address);
const idlWithAddress = { ...idl, address: programID.toBase58() };

const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "processed");

const getProvider = () => {
  return new AnchorProvider(
    connection,
    window.solana,
    anchor.AnchorProvider.defaultOptions()
  );
};

function App() {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState("user");

  // 🔐 admin auth states
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);

  // -------------------------
  // Wallet connect
  // -------------------------
  const connectWallet = async () => {
    if (!window.solana) {
      setError("Please install Phantom wallet");
      return;
    }

    try {
      setLoading(true);
      await window.solana.connect();
      setWalletAddress(window.solana.publicKey.toString());
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Wallet connection failed");
    } finally {
      setLoading(false);
    }
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // -------------------------
  // Admin password check
  // -------------------------
  const verifyAdminPassword = () => {
    if (adminPassword === "Untrusted@1234") {
      setIsAdminAuthorized(true);
      setShowAdminAuth(false);
      setCurrentPage("admin");
      setAdminPassword("");
      setAdminError("");
    } else {
      setAdminError("Invalid admin password");
    }
  };

  return (
    <div className="app-container">
      {/* ================= HEADER ================= */}
      <header className="header">
        <div className="header-content">
          <h1 className="app-title">Solana Voting dApp</h1>

          <div className="wallet-section">
            {walletAddress && (
              <span className="wallet-address" title={walletAddress}>
                {shortenAddress(walletAddress)}
              </span>
            )}

            <button
              className="connect-btn"
              onClick={connectWallet}
              disabled={loading}
            >
              {loading
                ? "Connecting..."
                : walletAddress
                ? "Connected"
                : "Connect Wallet"}
            </button>
          </div>
        </div>

        {error && <p className="status-message error">{error}</p>}
      </header>

      {/* ================= NAV ================= */}
      <nav className="page-nav">
        <button
          className={`nav-tab ${currentPage === "user" ? "active" : ""}`}
          onClick={() => setCurrentPage("user")}
        >
          🗳️ Voting
        </button>

        <button
          className={`nav-tab ${currentPage === "admin" ? "active" : ""}`}
          onClick={() => {
            if (!isAdminAuthorized) {
              setShowAdminAuth(true);
            } else {
              setCurrentPage("admin");
            }
          }}
        >
          ⚙️ Admin
        </button>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="main-content">
        {currentPage === "user" ? (
          <>
            {/* All Proposals */}
            <section className="section">
              <h2 className="section-title proposals">All Proposals</h2>
              <div className="cards-grid">
                <AllProposals
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
              </div>
            </section>

            {/* Tokens */}
            <section className="section">
              <h2 className="section-title tokens">Tokens</h2>
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

            {/* Voter */}
            <section className="section">
              <h2 className="section-title voter">Voter Management</h2>
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

            {/* Proposal actions */}
            <section className="section">
              <h2 className="section-title proposals">Proposal Actions</h2>
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
          </>
        ) : (
          <>
            {/* Admin page */}
            <section className="section">
              <h2 className="section-title admin">Admin Controls</h2>
              <p className="section-description">
                Only authorized admin can manage treasury.
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

            <section className="section">
              <h2 className="section-title treasury">Treasury Details</h2>
              <div className="cards-grid">
                <TreasuryInfo
                  walletAddress={walletAddress}
                  idlWithAddress={idlWithAddress}
                  getProvider={getProvider}
                />
              </div>
            </section>
          </>
        )}
      </main>

      {/* ================= ADMIN PASSWORD MODAL ================= */}
      {showAdminAuth && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Admin Access</h3>

            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />

            {adminError && <p className="error">{adminError}</p>}

            <div className="modal-actions">
              <button onClick={verifyAdminPassword}>Enter</button>
              <button
                className="cancel"
                onClick={() => {
                  setShowAdminAuth(false);
                  setAdminPassword("");
                  setAdminError("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
