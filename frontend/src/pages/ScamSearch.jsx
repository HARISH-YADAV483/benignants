import { useState } from "react";
import { searchScams } from "../services/scamService";
import bg from "../assets/backfround.jpeg"; // Ensure this matches your file path

export default function ScamSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      alert("Enter something to search");
      return;
    }

    setLoading(true);

    try {
      const res = await searchScams(query);
      setResults(res.data);
    } catch (err) {
      console.log(err);
      alert("Search failed!");
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const styles = `
    :root {
      --primary-red: #ff2a2a;
      --bg-dark: #050505;
      --card-bg: rgba(20, 20, 20, 0.95);
      --border-color: #333;
      --text-main: #e0e0e0;
      --text-muted: #888;
      --font-tech: 'Courier New', monospace;
      --font-main: 'Inter', sans-serif;
    }

    .search-page {
      min-height: 100vh;
      color: var(--text-main);
      font-family: var(--font-main);
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .page-title {
      font-size: 2rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 10px;
      text-align: center;
      text-shadow: 0 0 15px rgba(255, 42, 42, 0.5);
    }
    .page-title span { color: var(--primary-red); }

    .page-desc {
      text-align: center;
      color: var(--text-muted);
      font-family: var(--font-tech);
      max-width: 600px;
      margin-bottom: 30px;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    /* Search Bar Container */
    .search-container {
      width: 100%;
      max-width: 700px;
      margin-bottom: 40px;
    }

    .search-form {
      display: flex;
      gap: 10px;
      background: var(--card-bg);
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .search-input {
      flex: 1;
      background: #0a0a0a;
      border: 1px solid #333;
      color: #fff;
      padding: 12px 15px;
      font-family: var(--font-tech);
      font-size: 1rem;
      border-radius: 4px;
      transition: all 0.3s;
    }
    .search-input:focus {
      outline: none;
      border-color: var(--primary-red);
      box-shadow: 0 0 10px rgba(255, 42, 42, 0.2);
    }

    .search-btn {
      background: linear-gradient(135deg, #990000, #ff2a2a);
      color: #fff;
      border: none;
      padding: 0 25px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .search-btn:hover {
      box-shadow: 0 0 15px rgba(255, 42, 42, 0.4);
      transform: translateY(-1px);
    }

    /* Results Grid */
    .results-grid {
      width: 100%;
      max-width: 800px;
      display: grid;
      gap: 20px;
    }

    .result-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-left: 3px solid var(--primary-red);
      padding: 20px;
      border-radius: 6px;
      transition: transform 0.2s;
      animation: fadeIn 0.3s ease;
    }
    .result-card:hover {
      border-color: #555;
      transform: translateX(5px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .scam-title {
      margin: 0;
      font-size: 1.2rem;
      color: #fff;
    }

    .risk-badge {
      background: rgba(255, 42, 42, 0.15);
      color: var(--primary-red);
      border: 1px solid var(--primary-red);
      padding: 4px 8px;
      font-size: 0.8rem;
      font-family: var(--font-tech);
      border-radius: 4px;
      font-weight: bold;
      white-space: nowrap;
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

    .scam-desc {
      color: #bbb;
      font-size: 0.95rem;
      margin-bottom: 15px;
      line-height: 1.5;
    }

    .meta-row {
      display: flex;
      gap: 15px;
      font-size: 0.85rem;
      font-family: var(--font-tech);
      color: var(--text-muted);
      border-top: 1px dashed #333;
      padding-top: 10px;
    }
    .meta-item b { color: #e0e0e0; }

    /* Loading / Empty States */
    .status-msg {
      font-family: var(--font-tech);
      color: #666;
      margin-top: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Mobile */
    @media (max-width: 600px) {
      .search-form { flex-direction: column; }
      .search-btn { padding: 12px; }
      .card-header { flex-direction: column; gap: 8px; }
      .meta-row { flex-direction: column; gap: 5px; }
    }
  `;

  return (
    <div 
      className="search-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <style>{styles}</style>

      <h1 className="page-title">🔍 Global Threat <span>Search</span></h1>
      
      {/* ✅ Explanatory Paragraph */}
      <p className="page-desc">
        Access the verified scam database. Search by keywords, phone numbers, 
        platforms (e.g., 'WhatsApp', 'OTP'), or specific fraud techniques 
        to retrieve detailed incident reports and risk assessments.
      </p>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter keyword (e.g., 'Bank', '+9198...', 'Job Offer')"
          />
          <button className="search-btn" type="submit">
            Execute Search
          </button>
        </form>
      </div>

      {loading && <p className="status-msg">Scanning Database...</p>}

      <div className="results-grid">
        {results.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', color: '#555', fontStyle: 'italic' }}>
            No records found. Try different keywords.
          </div>
        ) : (
          results.map((scam) => (
            <div key={scam._id} className="result-card">
              <div className="card-header">
                <h3 className="scam-title">{scam.title}</h3>
                <div className="risk-badge">
                  RISK SCORE: {scam.susceptibilityScore}/100
                </div>
              </div>
              
              <p className="scam-desc">{scam.description}</p>
              
              <div className="meta-row">
                <span className="meta-item">
                  <b>TYPE:</b> {scam.scamType.toUpperCase()}
                </span>
                <span className="meta-item">
                  <b>PLATFORM:</b> {scam.platform.toUpperCase()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>


       <footer className="footer">
        👨‍💻 Developed by <span>Harish & Tarun (Benignants)</span>
      </footer>
    </div>
  );
}