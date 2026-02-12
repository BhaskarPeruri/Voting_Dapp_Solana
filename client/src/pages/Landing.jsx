import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing({ walletAddress }) {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📋",
      title: "View Proposals",
      description:
        "Browse and explore all active and completed proposals in the system.",
    },
    {
      icon: "🪙",
      title: "Token Management",
      description: "Buy voting tokens and check your token balance with ease.",
    },
    {
      icon: "👤",
      title: "Voter Registration",
      description: "Register as a voter and manage your voting credentials.",
    },
    {
      icon: "🗳️",
      title: "Cast Votes",
      description:
        "Participate in governance by casting your votes on proposals.",
    },
  ];

  const handleGetStarted = () => {
    if (walletAddress) {
      navigate("/tokens");
    }
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Solana Voting dApp</h1>
            <p className="hero-subtitle">
              Decentralized governance on Solana blockchain. Participate in
              voting, manage tokens, and shape the future of our community.
            </p>
            {walletAddress ? (
              <button className="hero-btn" onClick={handleGetStarted}>
                Get Started →
              </button>
            ) : (
              <p className="hero-notice">
                💡 Connect your Phantom wallet in the top right to get started
              </p>
            )}
          </div>
          <div className="hero-visual">
            <div className="hero-circle">
              <span className="hero-icon">🗳️</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-header">
          <h2>Key Features</h2>
          <p>Everything you need for decentralized governance</p>
        </div>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect Wallet</h3>
            <p>Link your Phantom wallet to the dApp safely and securely.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Buy Tokens</h3>
            <p>Purchase voting tokens to gain voting power in proposals.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Register</h3>
            <p>Register as a voter to become an active participant.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Vote</h3>
            <p>Cast your votes on active proposals and influence outcomes.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Join Our Community?</h2>
        <p>Start participating in decentralized governance today</p>
        {walletAddress ? (
          <button className="cta-btn" onClick={handleGetStarted}>
            Explore Proposals Now
          </button>
        ) : (
          <p className="cta-notice">
            Connect your wallet in the header to begin
          </p>
        )}
      </section>
    </div>
  );
}

export default Landing;
