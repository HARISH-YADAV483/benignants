import { useMemo, useState } from "react";
import bg from "../assets/backfround.jpeg"; // Ensure this matches your file path

export default function PasswordTool() {
  const [password, setPassword] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  // ✅ Generator options
  const [length, setLength] = useState(12);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  // ✅ Strength Logic
  const strengthData = useMemo(() => {
    const pwd = password.trim();

    if (!pwd) {
      return {
        score: 0,
        level: "WAITING FOR INPUT",
        color: "gray",
        tips: [],
      };
    }

    let score = 0;
    const tips = [];

    // length
    if (pwd.length >= 8) score += 20;
    else tips.push("Use at least 8 characters");

    if (pwd.length >= 12) score += 20;
    else tips.push("Use 12+ characters for better security");

    // character types
    if (/[a-z]/.test(pwd)) score += 15;
    else tips.push("Add lowercase letters (a-z)");

    if (/[A-Z]/.test(pwd)) score += 15;
    else tips.push("Add uppercase letters (A-Z)");

    if (/[0-9]/.test(pwd)) score += 15;
    else tips.push("Add numbers (0-9)");

    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
    else tips.push("Add symbols (!@#$%)");

    // common weak patterns
    if (/password|1234|qwerty|admin|letmein/i.test(pwd)) {
      score -= 30;
      tips.push("Avoid common passwords like '1234' or 'password'");
    }

    if (/^(.)\1+$/.test(pwd)) {
      score -= 25;
      tips.push("Avoid repeating same characters");
    }

    if (score < 0) score = 0;
    if (score > 100) score = 100;

    let level = "CRITICAL";
    let color = "red";

    if (score >= 70) {
      level = "SECURE";
      color = "green";
    } else if (score >= 40) {
      level = "MODERATE";
      color = "orange";
    }

    return { score, level, color, tips };
  }, [password]);

  // ✅ Generate password
  const generatePassword = () => {
    let chars = "";
    if (useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (useNumbers) chars += "0123456789";
    if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      alert("Select at least 1 option (Upper/Lower/Numbers/Symbols)");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    setGeneratedPassword(result);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ Copied to clipboard!");
    } catch (err) {
      alert("❌ Failed to copy");
    }
  };

  // Helper to map logic colors to theme colors
  const getThemeColor = (logicColor) => {
    if (logicColor === "green") return "var(--neon-green)";
    if (logicColor === "orange") return "var(--neon-orange)";
    if (logicColor === "red") return "var(--primary-red)";
    return "#555";
  };

  // --- STYLES ---
  const styles = `
    :root {
      --primary-red: #ff2a2a;
      --neon-green: #00e676;
      --neon-orange: #ff9100;
      --bg-dark: #050505;
      --card-bg: rgba(20, 20, 20, 0.95);
      --border-color: #333;
      --text-main: #e0e0e0;
      --text-muted: #888;
      --font-tech: 'Courier New', monospace;
      --font-main: 'Inter', sans-serif;
    }

    .tool-page {
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
      max-width: 600px;
      text-align: center;
      color: var(--text-muted);
      font-family: var(--font-tech);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 40px;
      border-bottom: 1px solid #333;
      padding-bottom: 20px;
    }

    .tool-container {
      width: 100%;
      max-width: 750px;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    /* Cards */
    .cyber-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-left: 4px solid var(--primary-red);
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
      backdrop-filter: blur(5px);
    }

    .card-header {
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 20px 0;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Input Styling */
    .cyber-input {
      width: 100%;
      padding: 15px;
      background: #0a0a0a;
      border: 1px solid #333;
      color: #fff;
      border-radius: 4px;
      font-family: var(--font-tech);
      font-size: 1.1rem;
      box-sizing: border-box;
      transition: all 0.3s;
    }
    .cyber-input:focus {
      border-color: var(--primary-red);
      outline: none;
      box-shadow: 0 0 15px rgba(255, 42, 42, 0.2);
    }

    /* Strength Meter */
    .strength-box {
      margin-top: 20px;
      background: #111;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #222;
    }
    
    .strength-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 0.9rem;
      text-transform: uppercase;
      font-weight: bold;
    }

    .progress-track {
      height: 8px;
      background: #333;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      transition: width 0.5s ease, background-color 0.5s ease;
      box-shadow: 0 0 10px currentColor;
    }

    .tips-list {
      margin-top: 15px;
      padding-left: 0;
      list-style: none;
    }
    .tip-item {
      color: #ff5f56;
      font-size: 0.85rem;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tip-item::before { content: "⚠️"; font-size: 0.8rem; }

    /* Generator Controls */
    .controls-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    /* Custom Checkbox */
    .check-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      color: #ccc;
      font-size: 0.9rem;
      user-select: none;
    }
    .check-input { display: none; }
    .custom-check {
      width: 18px;
      height: 18px;
      border: 1px solid #555;
      border-radius: 3px;
      background: #111;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.2s;
    }
    .check-input:checked + .custom-check {
      background: var(--primary-red);
      border-color: var(--primary-red);
      box-shadow: 0 0 8px rgba(255, 42, 42, 0.6);
    }
    .custom-check::after {
      content: '✓';
      color: #fff;
      font-size: 12px;
      display: none;
    }
    .check-input:checked + .custom-check::after { display: block; }

    /* Range Slider */
    .range-wrapper { margin-top: 10px; }
    .range-header { display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 5px; }
    
    input[type=range] {
      -webkit-appearance: none;
      width: 100%;
      background: transparent;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: var(--primary-red);
      cursor: pointer;
      margin-top: -6px;
      box-shadow: 0 0 10px rgba(255, 42, 42, 0.8);
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
      background: #333;
      border-radius: 2px;
    }

    /* Buttons */
    .action-btn {
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
      margin-top: 25px;
      transition: all 0.3s;
      font-size: 1rem;
    }
    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(255, 42, 42, 0.4);
    }
    
    .copy-btn {
      background: #222;
      border: 1px solid #444;
      margin-top: 10px;
    }
    .copy-btn:hover { background: #333; border-color: #fff; box-shadow: none; }

    /* Result Box */
    .result-box {
      margin-top: 25px;
      animation: fadeIn 0.3s ease;
    }
    .result-display {
      background: #000;
      border: 1px solid var(--primary-red);
      color: var(--primary-red);
      font-family: var(--font-tech);
      padding: 20px;
      border-radius: 4px;
      font-size: 1.2rem;
      text-align: center;
      word-break: break-all;
      letter-spacing: 1px;
      box-shadow: inset 0 0 20px rgba(255, 42, 42, 0.1);
    }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Mobile */
    @media (max-width: 600px) {
      .cyber-card { padding: 20px; }
      .page-title { font-size: 1.5rem; }
      .controls-grid { grid-template-columns: 1fr 1fr; }
    }
  `;

  return (
    <div 
      className="tool-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <style>{styles}</style>

      <h1 className="page-title">🔐 Security <span>Mainframe</span></h1>

      {/* ✅ New Explanatory Paragraph */}
      <p className="page-desc">
        Secure your digital footprint. Analyze your current credentials for vulnerabilities 
        or generate military-grade encryption keys instantly to protect against brute-force attacks.
      </p>

      <div className="tool-container">

        {/* ✅ Strength Checker */}
        <div className="cyber-card">
          <h2 className="card-header">🛡️ Password Diagnostic</h2>

          <input
            className="cyber-input"
            type="password"
            placeholder="INPUT CREDENTIALS..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="strength-box">
            <div className="strength-header">
              <span style={{color: '#888'}}>INTEGRITY LEVEL:</span>
              <span style={{ color: getThemeColor(strengthData.color) }}>
                {strengthData.level} ({strengthData.score}%)
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${strengthData.score}%`,
                  backgroundColor: getThemeColor(strengthData.color),
                }}
              />
            </div>

            {strengthData.tips.length > 0 && (
              <ul className="tips-list">
                {strengthData.tips.map((t, i) => (
                  <li key={i} className="tip-item">{t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ✅ Generator */}
        <div className="cyber-card">
          <h2 className="card-header">⚡ Key Generator</h2>

          <div className="range-wrapper">
            <div className="range-header">
              <span>LENGTH</span>
              <span style={{color: '#fff', fontWeight: 'bold'}}>{length} CHARS</span>
            </div>
            <input
              type="range"
              min="6"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>

          <div className="controls-grid">
            <label className="check-label">
              <input
                type="checkbox"
                className="check-input"
                checked={useUpper}
                onChange={() => setUseUpper(!useUpper)}
              />
              <span className="custom-check"></span>
              Uppercase
            </label>

            <label className="check-label">
              <input
                type="checkbox"
                className="check-input"
                checked={useLower}
                onChange={() => setUseLower(!useLower)}
              />
              <span className="custom-check"></span>
              Lowercase
            </label>

            <label className="check-label">
              <input
                type="checkbox"
                className="check-input"
                checked={useNumbers}
                onChange={() => setUseNumbers(!useNumbers)}
              />
              <span className="custom-check"></span>
              Numbers
            </label>

            <label className="check-label">
              <input
                type="checkbox"
                className="check-input"
                checked={useSymbols}
                onChange={() => setUseSymbols(!useSymbols)}
              />
              <span className="custom-check"></span>
              Symbols
            </label>
          </div>

          <button onClick={generatePassword} className="action-btn">
            Initiate Generation
          </button>

          {generatedPassword && (
            <div className="result-box">
              <div className="result-display">
                {generatedPassword}
              </div>

              <button
                onClick={() => copyToClipboard(generatedPassword)}
                className="action-btn copy-btn"
              >
                📋 Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}