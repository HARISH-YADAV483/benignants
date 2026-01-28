import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth"; // Ensure path is correct
import bg from "../../assets/backfround.jpeg"; // Ensure path is correct

export default function AdminDashboard() {
  // ✅ Scam Reports
  const [pendingReports, setPendingReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  // ✅ Blogs
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // ✅ Fetch pending scam reports
  const fetchPendingReports = async () => {
    try {
      setLoadingReports(true);
      const res = await axios.get("http://localhost:5001/api/admin/pending", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPendingReports(res.data || []);
    } catch (err) {
      console.log("❌ Pending reports error:", err);
    } finally {
      setLoadingReports(false);
    }
  };

  // ✅ Verify scam report
  const verifyReport = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/admin/verify/${id}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchPendingReports();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Verify report failed");
    }
  };

  // ✅ Reject scam report
  const rejectReport = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/admin/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchPendingReports();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Reject report failed");
    }
  };

  // ✅ Fetch pending blogs
  const fetchPendingBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const res = await axios.get("http://localhost:5001/api/blogs/admin/pending", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPendingBlogs(res.data || []);
    } catch (err) {
      console.log("❌ Pending blogs error:", err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  // ✅ Verify blog
  const verifyBlog = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/blogs/admin/verify/${id}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchPendingBlogs();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Verify blog failed");
    }
  };

  // ✅ Reject blog
  const rejectBlog = async (id) => {
    try {
      const adminNote = prompt("Enter rejection reason (optional):") || "Rejected";
      await axios.put(
        `http://localhost:5001/api/blogs/admin/reject/${id}`,
        { adminNote },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchPendingBlogs();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Reject blog failed");
    }
  };

  useEffect(() => {
    fetchPendingReports();
    fetchPendingBlogs();
  }, []);

  // --- STYLES ---
  const styles = `
    :root {
      --primary-red: #ff2a2a;
      --neon-green: #00e676;
      --bg-dark: #050505;
      --card-bg: rgba(22, 22, 22, 0.95);
      --border-color: #333;
      --text-main: #e0e0e0;
      --text-muted: #888;
      --font-tech: 'Courier New', monospace;
      --font-main: 'Inter', sans-serif;
    }

    .admin-dashboard {
      min-height: 100vh;
      color: var(--text-main);
      font-family: var(--font-main);
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 50px;
      border-bottom: 2px solid var(--primary-red);
      padding-bottom: 20px;
      width: 100%;
      max-width: 1200px;
    }

    .page-title {
      font-size: 2.5rem;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin: 0;
      text-shadow: 0 0 15px rgba(255, 42, 42, 0.5);
    }
    .page-title span { color: var(--primary-red); }

    /* Sections */
    .section-container {
      width: 100%;
      max-width: 1200px;
      margin-bottom: 60px;
    }

    .section-title {
      font-size: 1.5rem;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
      border-left: 5px solid;
      padding-left: 15px;
    }
    .title-scam { border-color: var(--primary-red); }
    .title-blog { border-color: var(--neon-green); }

    /* Grid Layout */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 25px;
    }

    /* Admin Card Shared Styles */
    .admin-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(5px);
    }
    .admin-card:hover {
      border-color: #555;
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    }

    /* Scams Specific */
    .scam-card { border-top: 3px solid var(--primary-red); }
    
    .risk-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      font-family: var(--font-tech);
      font-size: 0.8rem;
      padding: 4px 8px;
      background: rgba(255, 42, 42, 0.15);
      color: var(--primary-red);
      border: 1px solid var(--primary-red);
      border-radius: 4px;
    }

    /* Blogs Specific */
    .blog-card { border-top: 3px solid var(--neon-green); }
    
    .blog-img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #333;
      margin: 10px 0;
      opacity: 0.8;
      transition: opacity 0.3s;
    }
    .admin-card:hover .blog-img { opacity: 1; }

    /* Typography */
    .card-title { font-size: 1.2rem; margin: 0 0 10px 0; color: #fff; padding-right: 60px; } /* padding for badge */
    .card-desc { font-size: 0.9rem; color: #aaa; line-height: 1.5; margin-bottom: 15px; flex-grow: 1; }
    
    .meta-data {
      font-family: var(--font-tech);
      font-size: 0.75rem;
      color: var(--text-muted);
      border-top: 1px dashed #333;
      padding-top: 10px;
      margin-bottom: 15px;
    }
    .meta-row { display: flex; justify-content: space-between; margin-bottom: 5px; }

    /* Actions */
    .action-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .btn {
      padding: 10px;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.3s;
    }
    .btn-verify {
      background: rgba(0, 230, 118, 0.1);
      color: var(--neon-green);
      border: 1px solid var(--neon-green);
    }
    .btn-verify:hover { background: var(--neon-green); color: #000; }

    .btn-reject {
      background: rgba(255, 42, 42, 0.1);
      color: var(--primary-red);
      border: 1px solid var(--primary-red);
    }
    .btn-reject:hover { background: var(--primary-red); color: #fff; }

    /* States */
    .empty-state {
      text-align: center;
      padding: 40px;
      border: 1px dashed #444;
      background: rgba(0,0,0,0.3);
      color: #666;
      font-family: var(--font-tech);
      border-radius: 8px;
    }
    .loading-state { color: var(--primary-red); font-family: var(--font-tech); animation: blink 1s infinite; }
    
    @keyframes blink { 50% { opacity: 0.5; } }

    /* Mobile */
    @media (max-width: 600px) {
      .cards-grid { grid-template-columns: 1fr; }
      .page-title { font-size: 1.8rem; }
      .section-title { font-size: 1.2rem; }
    }
  `;

  return (
    <div 
      className="admin-dashboard"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.95)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <style>{styles}</style>

      <header className="dashboard-header">
        <h1 className="page-title">🛡️ Command <span>Center</span></h1>
      </header>

      {/* ✅ SECTION 1: Pending Scam Reports */}
      <div className="section-container">
        <h2 className="section-title title-scam">
          🚨 Incoming Threats ({pendingReports.length})
        </h2>

        {loadingReports ? (
          <p className="loading-state">SCANNING NETWORK FOR REPORTS...</p>
        ) : pendingReports.length === 0 ? (
          <div className="empty-state">✅ SYSTEM CLEAN: NO PENDING REPORTS</div>
        ) : (
          <div className="cards-grid">
            {pendingReports.map((r) => (
              <div key={r._id} className="admin-card scam-card">
                <div className="risk-badge">RISK: {r.susceptibilityScore}</div>
                
                <h3 className="card-title">{r.title}</h3>
                
                <p className="card-desc">
                  {r.description?.length > 120 
                    ? r.description.slice(0, 120) + "..." 
                    : r.description}
                </p>

                <div className="meta-data">
                  <div className="meta-row">
                    <span>TYPE:</span> <b>{r.scamType.toUpperCase()}</b>
                  </div>
                  <div className="meta-row">
                    <span>PLATFORM:</span> <b>{r.platform.toUpperCase()}</b>
                  </div>
                </div>

                <div className="action-row">
                  <button onClick={() => verifyReport(r._id)} className="btn btn-verify">
                    ✓ Verify
                  </button>
                  <button onClick={() => rejectReport(r._id)} className="btn btn-reject">
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ SECTION 2: Pending Blogs */}
      <div className="section-container">
        <h2 className="section-title title-blog">
          📝 Intel Verification ({pendingBlogs.length})
        </h2>

        {loadingBlogs ? (
          <p className="loading-state">ACCESSING ARCHIVES...</p>
        ) : pendingBlogs.length === 0 ? (
          <div className="empty-state">✅ QUEUE EMPTY: NO PENDING BLOGS</div>
        ) : (
          <div className="cards-grid">
            {pendingBlogs.map((b) => (
              <div key={b._id} className="admin-card blog-card">
                
                <h3 className="card-title">{b.title}</h3>
                
                {b.subtitle && (
                  <p style={{color: 'var(--neon-green)', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '10px'}}>
                    {b.subtitle}
                  </p>
                )}

                {b.images?.length > 0 && b.images[0] && (
                  <img src={b.images[0]} alt="preview" className="blog-img" />
                )}

                <p className="card-desc">
                  {b.body?.length > 100 
                    ? b.body.slice(0, 100) + "..." 
                    : b.body}
                </p>

                <div className="meta-data">
                  <div className="meta-row">
                    <span>AGENT:</span> <b>{b.author?.name || "Unknown"}</b>
                  </div>
                  <div className="meta-row">
                    <span>ID:</span> {b.author?.email}
                  </div>
                </div>

                <div className="action-row">
                  <button onClick={() => verifyBlog(b._id)} className="btn btn-verify">
                    ✓ Publish
                  </button>
                  <button onClick={() => rejectBlog(b._id)} className="btn btn-reject">
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}