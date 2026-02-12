import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import idl from "./idl/idl.json";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider } from "@coral-xyz/anchor";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import TokensPage from "./pages/TokensPage";
import VoterManagementPage from "./pages/VoterManagementPage";
import ProposalActionsPage from "./pages/ProposalActionsPage";
import AdminPage from "./pages/AdminPage";

import "./App.css";

const programID = new PublicKey(idl.address);
const idlWithAddress = { ...idl, address: programID.toBase58() };

const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "processed");

const getProvider = () => {
  return new AnchorProvider(
    connection,
    window.solana,
    anchor.AnchorProvider.defaultOptions(),
  );
};

function App() {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
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

  const handleLogoutAdmin = () => {
    setIsAdminAuthorized(false);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar
          walletAddress={walletAddress}
          onConnectWallet={connectWallet}
          loading={loading}
          isAdminAuthorized={isAdminAuthorized}
          onLogoutAdmin={handleLogoutAdmin}
        />

        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={<Landing walletAddress={walletAddress} />}
            />

            {walletAddress && (
              <>
                <Route
                  path="/tokens"
                  element={
                    <TokensPage
                      walletAddress={walletAddress}
                      idlWithAddress={idlWithAddress}
                      getProvider={getProvider}
                      connection={connection}
                    />
                  }
                />

                <Route
                  path="/voter"
                  element={
                    <VoterManagementPage
                      walletAddress={walletAddress}
                      idlWithAddress={idlWithAddress}
                      getProvider={getProvider}
                    />
                  }
                />

                <Route
                  path="/proposals"
                  element={
                    <ProposalActionsPage
                      walletAddress={walletAddress}
                      idlWithAddress={idlWithAddress}
                      getProvider={getProvider}
                    />
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <AdminPage
                      walletAddress={walletAddress}
                      idlWithAddress={idlWithAddress}
                      getProvider={getProvider}
                      isAdminAuthorized={isAdminAuthorized}
                      setIsAdminAuthorized={setIsAdminAuthorized}
                    />
                  }
                />
              </>
            )}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
