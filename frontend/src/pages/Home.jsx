import { Link } from "react-router-dom";
import logo from "../assets/scamshield-logo.png";
import bg from "../assets/backfround.jpeg";

export default function Home() {
  const cards = [
    { title: "🚨 Report a Scam", desc: "Report scam attempts and get instant susceptibility scoring with verified contact matching.", path: "/report", btn: "Report Now" },
    { title: "🔍 Scam Search", desc: "Search a database of verified scam reports to stay updated and protected.", path: "/search", btn: "Search Scams" },
    { title: "🎯 Phishing Simulator", desc: "Train with beginner → medium → pro phishing questions and level up your awareness.", path: "/phishing", btn: "Start Training" },
    { title: "🧾 Blogs", desc: "Read verified scam awareness blogs written by users and admins.", path: "/blogs", btn: "Explore Blogs" },
    { title: "🛠 Screenshot Analyzer", desc: "Upload suspicious screenshots and extract text using OCR to detect scam signals.", path: "/screenshot-analyzer", btn: "Analyze Screenshot" },
    { title: "🔐 Password Tool", desc: "Check password strength and generate secure passwords instantly.", path: "/password-tool", btn: "Open Tool" },
  ];

  return (
    <div
      className="home-root"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.78), rgba(0,0,0,0.88)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* HERO */}
      <section className="hero-section">
        <img src={logo} alt="ScamShield" className="hero-logo" />

        <p className="hero-text">
          A community-powered cybersecurity platform that helps people detect, report,
          and protect themselves from scams, frauds, phishing attacks, and social
          engineering threats.
        </p>
      </section>

      {/* CARDS GRID */}
      <section className="cards-section">
        <div className="cards-grid">
          {cards.map((c, i) => (
            <div key={i} className="feature-card">
              <h2>{c.title}</h2>
              <p>{c.desc}</p>

              <Link to={c.path} className="card-btn">
                {c.btn} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT PARAGRAPH (NEW) */}
      <section style={{ maxWidth: "900px", margin: "0 auto 40px", padding: "0 20px", textAlign: "center" }}>
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "rgba(255,255,255,0.75)" }}>
          ScamShield is built to empower users with awareness, education, and practical
          tools to fight online fraud. By combining real scam reports, simulations, and
          intelligent analysis, the platform helps individuals make safer digital
          decisions and stay one step ahead of evolving cyber threats.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        👨‍💻 Developed by <span>Harish & Tarun (Benignants)</span>
      </footer>

      {/* STYLES */}
      <style>{`
        * { box-sizing: border-box; }

        .home-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          color: white;
        }

        .hero-section {
          max-width: 1200px;
          margin: auto;
          padding: 90px 20px 60px;
          text-align: center;
        }

        .hero-logo {
          height: 170px;
          margin-bottom: 28px;
          filter: drop-shadow(0 0 35px rgba(255,60,60,0.45));
        }

        .hero-text {
          font-size: 19px;
          max-width: 900px;
          margin: auto;
          line-height: 1.8;
          color: rgba(255,255,255,0.85);
        }

        .cards-section {
          width: 100%;
          padding: 40px 20px 80px;
          display: flex;
          justify-content: center;
        }

        .cards-grid {
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-card {
          background: linear-gradient(#fffaf0, #fff4e6);
          color: #111;
          padding: 30px 26px;
          min-height: 250px;
          border-radius: 22px;
          border-top: 4px solid #ff3b3b;
          box-shadow: 0 15px 45px rgba(0,0,0,0.55);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 22px 65px rgba(255,60,60,0.25);
        }

        .card-btn {
          margin-top: 20px;
          padding: 11px 20px;
          background: linear-gradient(90deg, #ff2a2a, #ff6a6a);
          color: white;
          border-radius: 14px;
          font-weight: 700;
          text-decoration: none;
        }

        .footer {
          margin-top: auto;
          text-align: center;
          padding: 26px 16px;
          background: #050505;
          border-top: 1px solid rgba(255,255,255,0.2);
          font-weight: 600;
        }

        .footer span {
          color: #ff3b3b;
        }

        @media (max-width: 1100px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .hero-logo { height: 110px; }
          .hero-text { font-size: 14.5px; }
          .cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}