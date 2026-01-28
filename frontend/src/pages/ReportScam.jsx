import { useState } from "react";
import { reportScam } from "../services/scamService";
import bg from "../assets/backfround.jpeg"; // Ensure this matches your file path

export default function ReportScam() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    scamType: "other",
    platform: "other",
    scammerContact: "",
    lossAmount: 0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await reportScam(form);
      setResult(res.data);
    } catch (err) {
      alert("Something went wrong!");
      console.log(err);
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

    .report-page {
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
      margin-bottom: 40px;
      font-size: 0.9rem;
    }

    /* Main Card */
    .report-card {
      background: var(--card-bg);
      width: 100%;
      max-width: 650px;
      padding: 30px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      border-top: 4px solid var(--primary-red);
      box-shadow: 0 15px 50px rgba(0,0,0,0.8);
      backdrop-filter: blur(10px);
    }

    /* Form Layout */
    .form-group {
      margin-bottom: 15px;
    }

    .input-label {
      display: block;
      color: #aaa;
      font-family: var(--font-tech);
      font-size: 0.8rem;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }

    .grid-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    /* Inputs */
    .cyber-input, .cyber-select, .cyber-textarea {
      width: 100%;
      padding: 12px;
      background: #0a0a0a;
      border: 1px solid #333;
      color: #fff;
      border-radius: 4px;
      font-family: var(--font-tech);
      box-sizing: border-box;
      transition: all 0.3s;
      font-size: 0.95rem;
    }
    .cyber-input:focus, .cyber-select:focus, .cyber-textarea:focus {
      border-color: var(--primary-red);
      outline: none;
      box-shadow: 0 0 10px rgba(255, 42, 42, 0.2);
    }
    .cyber-textarea {
      height: 120px;
      resize: vertical;
    }
    
    /* Submit Button */
    .submit-btn {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #990000, #ff2a2a);
      border: none;
      color: white;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
      transition: all 0.3s;
      font-size: 1rem;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(255, 42, 42, 0.4);
    }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; background: #444; }

    /* Results Section */
    .result-container {
      margin-top: 30px;
      border-top: 1px dashed #444;
      padding-top: 25px;
      animation: fadeIn 0.5s ease;
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
    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      background: #111;
      padding: 15px;
      border-radius: 4px;
      border-left: 3px solid #fff;
    }
    .result-header h2 { margin: 0; font-size: 1.2rem; color: #fff; }
    
    .score-badge {
      font-family: var(--font-tech);
      font-size: 1.1rem;
      color: var(--primary-red);
      font-weight: bold;
    }

    /* High Risk Warning */
    .warning-box {
      background: rgba(255, 42, 42, 0.1);
      border: 1px solid var(--primary-red);
      color: var(--primary-red);
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      text-align: center;
      font-weight: bold;
      text-transform: uppercase;
      animation: pulse 2s infinite;
    }

    /* Match Box */
    .match-box {
      border: 1px solid #444;
      background: #0d0d0d;
      padding: 20px;
      border-radius: 6px;
    }
    .match-title {
      color: #00e676;
      margin: 0 0 15px 0;
      border-bottom: 1px solid #333;
      padding-bottom: 10px;
      font-size: 1rem;
      text-transform: uppercase;
    }

    .match-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .match-item {
      background: #161616;
      border: 1px solid #333;
      padding: 15px;
      border-radius: 4px;
      font-family: var(--font-tech);
      font-size: 0.85rem;
    }
    .match-item p { margin: 4px 0; color: #bbb; }
    .match-item b { color: #fff; }
    .tag {
      background: #333;
      color: #aaa;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.75rem;
      margin-right: 5px;
    }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0% { box-shadow: 0 0 0 rgba(255, 42, 42, 0); } 50% { box-shadow: 0 0 15px rgba(255, 42, 42, 0.3); } 100% { box-shadow: 0 0 0 rgba(255, 42, 42, 0); } }

    /* Mobile */
    @media (max-width: 600px) {
      .grid-row { grid-template-columns: 1fr; }
      .report-card { padding: 20px; }
      .page-title { font-size: 1.5rem; }
    }
  `;

  return (
    <div 
      className="report-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <style>{styles}</style>

      <h1 className="page-title">🚨 Incident <span>Reporting</span></h1>
      <p className="page-desc">
        Reporting a scam helps protect not just you, but thousands of others. When you submit a report, ScamShield analyzes the scam using verified databases and intelligent detection to identify risk patterns, flag known scam contacts, and generate actionable safety guidance. Your report strengthens our community-powered defense system, helping stop scams early and prevent future victims.
      </p>

      <div className="report-card">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="input-label">Incident Title</label>
            <input
              name="title"
              placeholder="e.g. Bank KYC Fraud"
              value={form.title}
              onChange={handleChange}
              required
              className="cyber-input"
            />
          </div>

          <div className="form-group">
            <label className="input-label">Description of Event</label>
            <textarea
              name="description"
              placeholder="Describe what happened..."
              value={form.description}
              onChange={handleChange}
              required
              className="cyber-textarea"
            />
          </div>

          <div className="grid-row">
            <div className="form-group">
              <label className="input-label">Scam Category</label>
              <select
                name="scamType"
                value={form.scamType}
                onChange={handleChange}
                className="cyber-select"
              >
                <option value="phishing">Phishing</option>
                <option value="upi">UPI Fraud</option>
                <option value="job">Job Offer</option>
                <option value="investment">Investment/Crypto</option>
                <option value="otp">OTP Theft</option>
                <option value="crypto">Crypto Scam</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Platform Used</label>
              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="cyber-select"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="call">Voice Call</option>
                <option value="other">Other Platform</option>
              </select>
            </div>
          </div>

          <div className="grid-row">
            <div className="form-group">
              <label className="input-label">Suspect Contact (ID/Phone)</label>
              <input
                name="scammerContact"
                placeholder="+91 XXXXX XXXXX"
                value={form.scammerContact}
                onChange={handleChange}
                className="cyber-input"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Loss Amount (₹)</label>
              <input
                name="lossAmount"
                type="number"
                placeholder="0"
                value={form.lossAmount}
                onChange={handleChange}
                className="cyber-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "PROCESSING DATA..." : "SUBMIT REPORT"}
          </button>
        </form>

        {/* ✅ RESULT SECTION */}
        {result?.report && (
          <div className="result-container">
            
            <div className="result-header">
              <h2>✅ REPORT FILED</h2>
              <div className="score-badge">
                RISK SCORE: {result.report.susceptibilityScore}/100
              </div>
            </div>
            
            <div style={{marginBottom: '15px', color: '#888', textAlign: 'right', fontFamily: 'monospace'}}>
              STATUS: <span style={{color: '#fff', textTransform: 'uppercase'}}>{result.report.status}</span>
            </div>

            {/* ✅ Verified Contact Match Box */}
            {result.contactMatchPercent > 0 && (
              <div className="match-wrapper">
                {/* ✅ HIGH RISK WARNING */}
                {result.contactMatchPercent >= 70 &&
                  result.matchedVerifiedContacts?.length > 0 && (
                    <div className="warning-box">
                      🚨 CRITICAL ALERT: VERIFIED SCAM ENTITY DETECTED
                    </div>
                  )}

                <div className="match-box">
                  <h3 className="match-title">
                    🔍 DATABASE CROSS-REFERENCE MATCH: {result.contactMatchPercent}%
                  </h3>

                  {result.matchedVerifiedContacts?.length > 0 ? (
                    <>
                      <p style={{ color: "#aaa", marginBottom: "15px", fontSize: "0.9rem" }}>
                        Positive identification against known threats:
                      </p>

                      <ul className="match-list">
                        {result.matchedVerifiedContacts.map((item, idx) => (
                          <li key={idx} className="match-item">
                            <p><b>TARGET:</b> {item.value} <span style={{color: 'var(--primary-red)'}}>({item.type.toUpperCase()})</span></p>
                            <p><b>CONFIDENCE:</b> {item.similarity}%</p>
                            <p><b>ORIGIN:</b> {item.source || "UNKNOWN"}</p>
                            <p><b>INTEL:</b> {item.notes || "No additional notes"}</p>
                            <p style={{marginTop: '8px'}}>
                              {item.tags?.length > 0 ? item.tags.map((t, i) => <span key={i} className="tag">{t}</span>) : "N/A"}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p style={{ color: "#888", fontStyle: "italic" }}>
                      ℹ️ Partial similarity detected. No definitive 70%+ match in verified database.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>


       <footer className="footer">
        👨‍💻 Developed by <span>Harish & Tarun (Benignants)</span>
      </footer>
    </div>
  );
}