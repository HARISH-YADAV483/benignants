import { useEffect, useState } from "react";
import { getQuestions, submitAnswer, saveProgress } from "../services/phishingService";
import { getMyProfile } from "../services/userService";

export default function PhishingSimulator() {
  const [level, setLevel] = useState("beginner");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);

  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);

  // ✅ Track status of every question locally
  // "unattempted" | "correct" | "wrong"
  const [attemptMap, setAttemptMap] = useState({});

  const loadProgressAndQuestions = async (lvl) => {
    setLoading(true);
    setFeedback(null);
    setSelected(null);

    try {
      const profileRes = await getMyProfile();

      if (!profileRes.data?.user) {
        alert("⚠️ Please login to continue");
        setLoading(false);
        return;
      }

      const userProgress = profileRes.data.user.phishingProgress;

      // ✅ saved index + attemptMap from DB (resume)
      const savedIndex = userProgress?.[lvl]?.currentIndex ?? 0;
      const savedAttemptMap = userProgress?.[lvl]?.attemptMap ?? {};

      setProgress(userProgress);

      const qRes = await getQuestions(lvl);
      const qList = qRes.data || [];
      setQuestions(qList);

      // ✅ create default map for all questions
      const defaultMap = {};
      qList.forEach((q) => {
        defaultMap[String(q._id)] = "unattempted";
      });

      // ✅ merge DB map (correct/wrong) into default map
      const mergedMap = { ...defaultMap, ...savedAttemptMap };
      setAttemptMap(mergedMap);

      // ✅ resume index
      if (savedIndex >= 0 && savedIndex < qList.length) {
        setIndex(savedIndex);
      } else {
        setIndex(0);
      }
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to load simulator");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgressAndQuestions(level);
    // eslint-disable-next-line
  }, [level]);

  const current = questions[index];

  // ✅ Level Locking
  const canSelectLevel = (lvl) => {
    if (!progress) return false;
    if (lvl === "beginner") return true;
    if (lvl === "medium") return progress.beginner.completed;
    if (lvl === "pro") return progress.medium.completed;
    return false;
  };

  // ✅ Only unlock next question if all previous attempted
  const isQuestionUnlocked = (targetIndex) => {
    if (targetIndex === 0) return true;

    for (let i = 0; i < targetIndex; i++) {
      const qid = String(questions[i]?._id);
      if (!qid) continue;

      if (!attemptMap[qid] || attemptMap[qid] === "unattempted") {
        return false;
      }
    }
    return true;
  };

  const handleJumpToQuestion = async (targetIndex) => {
    if (!isQuestionUnlocked(targetIndex)) {
      alert("❌ Complete previous questions to unlock this one!");
      return;
    }

    setIndex(targetIndex);
    setSelected(null);
    setFeedback(null);

    try {
      await saveProgress({ level, currentIndex: targetIndex });
    } catch (err) {
      console.log("Save progress failed:", err);
    }
  };

  const handleChoose = async (answer) => {
    if (!current) return;
    if (selected) return;

    setSelected(answer);

    try {
      const res = await submitAnswer({
        questionId: current._id,
        selectedAnswer: answer,
        currentIndex: index,
      });

      setFeedback({
        isCorrect: res.data.isCorrect,
        explanation: res.data.explanation,
      });

      if (res.data.attemptMap) {
        setAttemptMap((prev) => ({
          ...prev,
          ...res.data.attemptMap,
        }));
      } else {
        setAttemptMap((prev) => ({
          ...prev,
          [String(current._id)]: res.data.isCorrect ? "correct" : "wrong",
        }));
      }

      setProgress(res.data.progress);
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Submit failed");
    }
  };

  const nextQuestion = async () => {
    if (!current) return;
    if (!attemptMap[String(current._id)] || attemptMap[String(current._id)] === "unattempted") return;

    setSelected(null);
    setFeedback(null);

    if (index < questions.length - 1) {
      const newIndex = index + 1;
      if (!isQuestionUnlocked(newIndex)) {
        alert("❌ Complete previous questions first!");
        return;
      }
      setIndex(newIndex);
      try {
        await saveProgress({ level, currentIndex: newIndex });
      } catch (err) {
        console.log("Save progress failed:", err);
      }
    }
  };

  const prevQuestion = async () => {
    setSelected(null);
    setFeedback(null);

    if (index > 0) {
      const newIndex = index - 1;
      setIndex(newIndex);
      try {
        await saveProgress({ level, currentIndex: newIndex });
      } catch (err) {
        console.log("Save progress failed:", err);
      }
    }
  };

  const retryQuestion = () => {
    setSelected(null);
    setFeedback(null);
    if (current?._id) {
      setAttemptMap((prev) => ({
        ...prev,
        [String(current._id)]: "unattempted",
      }));
    }
  };

  // --- RENDER HELPERS ---

  const renderOptions = () => {
    if (!current) return null;

    if (current.format === "binary") {
      return (
        <div className="options-grid">
          <button className="option-btn safe" onClick={() => handleChoose("safe")}>
            <span className="icon">🛡️</span> Safe
          </button>
          <button className="option-btn phishing" onClick={() => handleChoose("phishing")}>
            <span className="icon">🎣</span> Phishing
          </button>
        </div>
      );
    }

    return (
      <div className="options-list">
        {current.options?.map((opt, i) => (
          <button key={i} onClick={() => handleChoose(opt)} className="option-btn text-option">
            {opt}
          </button>
        ))}
      </div>
    );
  };

  const renderScenario = () => {
    if (!current?.scenario) return null;
    const s = current.scenario;

    return (
      <div className="scenario-card">
        <div className="card-header">
          <div className="dot red"></div>
          <div className="dot yellow"></div>
          <div className="dot green"></div>
          <span className="header-title">Incoming Message</span>
        </div>
        <div className="card-body">
          {current.category && (
            <div className="meta-row">
              <span className="meta-label">Type:</span> <span className="meta-value tag">{current.category.toUpperCase()}</span>
            </div>
          )}
          {s.senderName && (
            <div className="meta-row">
              <span className="meta-label">From:</span> <span className="meta-value">{s.senderName}</span>
            </div>
          )}
          {s.senderEmail && (
            <div className="meta-row">
              <span className="meta-label">Email:</span> <span className="meta-value email-text">{s.senderEmail}</span>
            </div>
          )}
          {s.subject && (
            <div className="meta-row">
              <span className="meta-label">Subject:</span> <span className="meta-value">{s.subject}</span>
            </div>
          )}
          <hr className="divider" />
          {s.message && <div className="message-body">{s.message}</div>}
          {s.urlPreview && (
            <div className="url-preview">
              <span className="link-icon">🔗</span> {s.urlPreview}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderQuestionNavigator = () => {
    return (
      <div className="navigator-panel">
        <h3 className="nav-title">Mission Log</h3>
        <div className="nav-grid">
          {questions.map((q, i) => {
            const status = attemptMap[String(q._id)] || "unattempted";
            const unlocked = isQuestionUnlocked(i);
            
            let statusClass = "nav-item unattempted";
            if (status === "correct") statusClass = "nav-item correct";
            if (status === "wrong") statusClass = "nav-item wrong";
            if (i === index) statusClass += " active";
            if (!unlocked) statusClass += " locked";

            return (
              <button
                key={q._id}
                onClick={() => handleJumpToQuestion(i)}
                disabled={!unlocked}
                className={statusClass}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="nav-legend">
          <div className="legend-item"><span className="dot gray"></span> Pending</div>
          <div className="legend-item"><span className="dot green"></span> Secure</div>
          <div className="legend-item"><span className="dot red"></span> Breached</div>
        </div>
      </div>
    );
  };

  // --- STYLES INJECTION ---
  const styles = `
    /* Reset & Base */
    :root {
      --bg-dark: #0a0a0a;
      --card-bg: #161616;
      --card-border: #333333;
      --text-main: #e0e0e0;
      --text-muted: #888888;
      --primary-red: #ff2a2a;
      --accent-red: #990000;
      --success-green: #00e676;
      --font-stack: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .phishing-app {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font-stack);
      min-height: 100vh;
      padding: 20px;
      box-sizing: border-box;
    }

    .app-title {
      font-size: 2rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #fff;
      margin-bottom: 20px;
      border-bottom: 2px solid var(--primary-red);
      display: inline-block;
      padding-bottom: 5px;
    }
    
    .app-title span { color: var(--primary-red); }

    /* Level Tabs */
    .level-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .level-btn {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 10px 20px;
      cursor: pointer;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
    }

    .level-btn:hover { border-color: var(--primary-red); color: #fff; }
    .level-btn.active { background: var(--primary-red); color: #000; border-color: var(--primary-red); box-shadow: 0 0 15px rgba(255, 42, 42, 0.4); }
    .level-btn.locked { opacity: 0.3; cursor: not-allowed; border-color: #222; }

    /* Main Layout */
    .main-layout {
      display: flex;
      gap: 25px;
      align-items: flex-start;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .main-layout { flex-direction: column; }
      .navigator-panel { width: 100% !important; margin-bottom: 20px; }
      .nav-grid { justify-content: center; }
    }

    /* Navigator */
    .navigator-panel {
      width: 260px;
      flex-shrink: 0;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      padding: 20px;
      border-radius: 8px;
    }

    .nav-title { margin: 0 0 15px 0; font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); }

    .nav-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin-bottom: 15px;
    }

    .nav-item {
      aspect-ratio: 1;
      border: none;
      background: #222;
      color: #666;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .nav-item.active { border: 2px solid #fff; color: #fff; }
    .nav-item.correct { background: rgba(0, 230, 118, 0.2); color: var(--success-green); border: 1px solid var(--success-green); }
    .nav-item.wrong { background: rgba(255, 42, 42, 0.2); color: var(--primary-red); border: 1px solid var(--primary-red); }
    .nav-item.locked { opacity: 0.3; cursor: not-allowed; }
    .nav-item:hover:not(:disabled) { transform: translateY(-2px); }

    .nav-legend { font-size: 0.8rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 5px; }
    .legend-item { display: flex; align-items: center; gap: 8px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .dot.gray { background: #444; }
    .dot.green { background: var(--success-green); }
    .dot.red { background: var(--primary-red); }

    /* Content Area */
    .content-area { flex: 1; width: 100%; }

    /* Scenario Card */
    .scenario-card {
      background: #1e1e1e;
      border-left: 4px solid var(--primary-red);
      border-radius: 6px;
      margin-bottom: 25px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      overflow: hidden;
    }

    .card-header {
      background: #252525;
      padding: 8px 15px;
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .header-title { margin-left: auto; font-size: 0.75rem; color: #555; text-transform: uppercase; letter-spacing: 1px; }
    .card-header .dot { width: 10px; height: 10px; }
    .card-header .dot.red { background: #ff5f56; }
    .card-header .dot.yellow { background: #ffbd2e; }
    .card-header .dot.green { background: #27c93f; }

    .card-body { padding: 20px; font-family: 'Courier New', monospace; font-size: 0.95rem; }
    .meta-row { margin-bottom: 8px; display: flex; }
    .meta-label { width: 70px; color: var(--text-muted); font-weight: bold; }
    .meta-value { color: #fff; flex: 1; word-break: break-all; }
    .meta-value.tag { background: #333; padding: 2px 6px; border-radius: 3px; font-size: 0.8rem; }
    .meta-value.email-text { color: #4fc3f7; }
    .divider { border: 0; border-top: 1px dashed #444; margin: 15px 0; }
    .message-body { line-height: 1.5; color: #ddd; white-space: pre-wrap; }
    .url-preview { margin-top: 15px; background: #2a1b1b; color: #ff8a80; padding: 10px; border-radius: 4px; font-size: 0.9rem; border: 1px solid #502020; }

    /* Question Box */
    .question-box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .q-number { font-size: 0.85rem; color: var(--primary-red); text-transform: uppercase; font-weight: bold; letter-spacing: 1px; display: block; margin-bottom: 8px; }
    .q-text { font-size: 1.1rem; line-height: 1.4; margin: 0; }

    /* Options */
    .options-grid { display: flex; gap: 15px; margin-top: 20px; }
    .options-list { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }

    .option-btn {
      background: #222;
      border: 1px solid #444;
      color: #fff;
      padding: 15px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      text-align: left;
      transition: all 0.2s;
    }
    .option-btn:hover { background: #333; border-color: #666; transform: translateX(5px); }
    .option-btn.safe:hover { border-color: var(--success-green); box-shadow: 0 0 10px rgba(0,230,118,0.2); transform: translateY(-3px); }
    .option-btn.phishing:hover { border-color: var(--primary-red); box-shadow: 0 0 10px rgba(255,42,42,0.2); transform: translateY(-3px); }
    
    .option-btn .icon { margin-right: 10px; font-size: 1.2rem; }
    .options-grid .option-btn { flex: 1; text-align: center; font-weight: bold; }

    /* Feedback */
    .feedback-box {
      margin-top: 25px;
      padding: 20px;
      border-radius: 8px;
      animation: fadeIn 0.3s ease;
    }
    .feedback-box.correct { background: rgba(0, 230, 118, 0.1); border: 1px solid var(--success-green); }
    .feedback-box.wrong { background: rgba(255, 42, 42, 0.1); border: 1px solid var(--primary-red); }
    .feedback-title { margin: 0 0 10px 0; font-size: 1.2rem; }
    .feedback-desc { margin: 0; line-height: 1.5; color: #ccc; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Controls */
    .controls { display: flex; gap: 10px; margin-top: 30px; justify-content: flex-end; }
    .ctrl-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.2s;
    }
    .ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .ctrl-btn.secondary { background: transparent; border: 1px solid #444; color: #aaa; }
    .ctrl-btn.secondary:hover:not(:disabled) { border-color: #fff; color: #fff; }
    
    .ctrl-btn.retry { background: #333; color: var(--primary-red); border: 1px solid var(--primary-red); }
    .ctrl-btn.retry:hover { background: var(--primary-red); color: #000; }

    .ctrl-btn.primary { background: #fff; color: #000; }
    .ctrl-btn.primary:hover:not(:disabled) { background: var(--primary-red); color: #fff; box-shadow: 0 0 15px rgba(255, 42, 42, 0.5); }

    /* Loader */
    .loader-container { height: 100vh; display: flex; justify-content: center; align-items: center; background: var(--bg-dark); color: var(--primary-red); font-family: monospace; font-size: 1.5rem; }
  `;

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loader-container">INITIALIZING SIMULATION...</div>
    </>
  );

  const statusNow = current ? attemptMap[String(current._id)] : null;

  if (!current) {
    return (
      <div className="phishing-app">
        <style>{styles}</style>
        <div style={{ padding: "40px", textAlign: "center", border: "1px dashed #444", borderRadius: "10px" }}>
          <h2>🚫 No Data Found</h2>
          <p style={{color: "#888"}}>No simulation data available for this security level.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="phishing-app">
      {/* Inject CSS Styles */}
      <style>{styles}</style>

      <div className="header">
        <h1 className="app-title">Phishing <span>Simulator</span></h1>
      </div>

      <div className="level-tabs">
        <button 
          className={`level-btn ${level === "beginner" ? "active" : ""}`} 
          onClick={() => setLevel("beginner")}
        >
          Beginner
        </button>

        <button
          className={`level-btn ${level === "medium" ? "active" : ""} ${!canSelectLevel("medium") ? "locked" : ""}`}
          onClick={() => {
            if (!canSelectLevel("medium")) return alert("⚠️ Clearance Level Denied. Complete Beginner first.");
            setLevel("medium");
          }}
        >
          Medium
        </button>

        <button
          className={`level-btn ${level === "pro" ? "active" : ""} ${!canSelectLevel("pro") ? "locked" : ""}`}
          onClick={() => {
            if (!canSelectLevel("pro")) return alert("⚠️ Clearance Level Denied. Complete Medium first.");
            setLevel("pro");
          }}
        >
          Pro
        </button>
      </div>

      <div className="main-layout">
        {/* Left Side: Navigator */}
        {renderQuestionNavigator()}

        {/* Right Side: Content */}
        <div className="content-area">
          
          {/* Email/Scenario View */}
          {renderScenario()}

          {/* Question Text */}
          <div className="question-box">
            <span className="q-number">Target {index + 1} / {questions.length}</span>
            <h3 className="q-text">{current.question}</h3>
          </div>

          {/* Options */}
          {renderOptions()}

          {/* Feedback Display */}
          {feedback && (
            <div className={`feedback-box ${feedback.isCorrect ? "correct" : "wrong"}`}>
              <h3 className="feedback-title">
                {feedback.isCorrect ? "✅ Threat Averted" : "❌ System Compromised"}
              </h3>
              <p className="feedback-desc">
                <b>Analysis:</b> {feedback.explanation}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="controls">
            <button
              className="ctrl-btn secondary"
              onClick={prevQuestion}
              disabled={index === 0}
            >
              ← Previous
            </button>

            {statusNow === "wrong" && (
              <button className="ctrl-btn retry" onClick={retryQuestion}>
                ↻ Retry
              </button>
            )}

            <button
              className="ctrl-btn primary"
              onClick={nextQuestion}
              disabled={!statusNow || statusNow === "unattempted"}
            >
              Next Mission →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}