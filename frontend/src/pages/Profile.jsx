import { useEffect, useState } from "react";
import axios from "axios";

import { getMyProfile, updateProfilePic } from "../services/userService";
import { getMyBlogs } from "../services/blogService";
import { getToken } from "../utils/auth";
import bg from "../assets/backfround.jpeg"; // Ensure spelling matches your file system

export default function Profile() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const profileRes = await getMyProfile();
      const u = profileRes.data?.user;

      if (!u) {
        setErrorMsg("Please login to view profile.");
        setLoading(false);
        return;
      }

      setUser(u);

      const myBlogsRes = await getMyBlogs();
      setBlogs(myBlogsRes.data || []);
    } catch (err) {
      console.log(err);
      setErrorMsg(err?.response?.data?.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleUploadProfilePic = async () => {
    try {
      if (!imageFile) {
        alert("⚠️ Please select an image first");
        return;
      }

      setUploading(true);

      const fd = new FormData();
      fd.append("image", imageFile);

      const uploadRes = await axios.post(
        "http://localhost:5001/api/upload/image",
        fd,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedUrl = uploadRes.data?.url;

      if (!uploadedUrl) {
        alert("❌ Upload failed");
        setUploading(false);
        return;
      }

      await updateProfilePic(uploadedUrl);
      alert("✅ Profile picture updated successfully!");

      setImageFile(null);
      loadProfileData();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "❌ Failed to update profile pic");
    } finally {
      setUploading(false);
    }
  };

  // --- STYLES ---
  const styles = `
    :root {
      --bg-dark: #050505;
      --card-bg: rgba(22, 22, 22, 0.95);
      --border-color: #333;
      --primary-red: #ff2a2a;
      --text-main: #e0e0e0;
      --text-muted: #888;
      --font-tech: 'Courier New', monospace;
      --font-main: 'Inter', sans-serif;
    }

    .profile-page {
      min-height: 100vh;
      color: var(--text-main);
      font-family: var(--font-main);
      padding: 40px 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .page-title {
      font-size: 2rem;
      text-transform: uppercase;
      letter-spacing: 3px;
      border-bottom: 2px solid var(--primary-red);
      padding-bottom: 10px;
      margin-bottom: 40px;
      text-shadow: 0 0 10px rgba(255, 42, 42, 0.5);
    }

    /* Layout Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      width: 100%;
      max-width: 1000px;
    }

    @media (max-width: 850px) {
      .dashboard-grid { grid-template-columns: 1fr; }
    }

    /* Cards */
    .cyber-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-left: 3px solid var(--primary-red);
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.7);
      backdrop-filter: blur(5px);
      transition: transform 0.2s;
    }
    .cyber-card:hover { border-color: #555; }

    .card-title {
      margin: 0 0 20px 0;
      font-size: 1.1rem;
      color: var(--primary-red);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Identity Section */
    .identity-wrapper {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    @media (max-width: 500px) {
      .identity-wrapper { flex-direction: column; text-align: center; }
    }

    .profile-pic-container {
      position: relative;
    }

    .profile-pic {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--primary-red);
      box-shadow: 0 0 20px rgba(255, 42, 42, 0.4);
    }

    .user-details h3 {
      font-size: 1.5rem;
      margin: 0 0 5px 0;
      color: #fff;
    }
    .user-details p {
      margin: 4px 0;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .user-details .email { font-family: var(--font-tech); color: #bbb; }

    /* Upload Controls */
    .upload-section {
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px dashed #333;
    }
    
    .file-input-wrapper {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    @media (max-width: 500px) { .file-input-wrapper { flex-direction: column; } }

    .custom-file-label {
      background: #222;
      border: 1px solid #444;
      color: #ccc;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      flex: 1;
      text-align: center;
      transition: all 0.2s;
    }
    .custom-file-label:hover { background: #333; color: #fff; }

    .upload-btn {
      background: linear-gradient(135deg, #990000, #ff2a2a);
      border: none;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 1px;
      transition: all 0.3s;
    }
    .upload-btn:hover:not(:disabled) {
      box-shadow: 0 0 15px rgba(255, 42, 42, 0.6);
      transform: translateY(-2px);
    }
    .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Stats Grid */
    .stats-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .stat-box {
      background: #111;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #222;
      text-align: center;
    }
    .stat-label { font-size: 0.75rem; color: #888; text-transform: uppercase; margin-bottom: 5px; display: block; }
    .stat-value { font-size: 1.2rem; color: #fff; font-family: var(--font-tech); font-weight: bold; }
    .stat-value.highlight { color: var(--primary-red); text-shadow: 0 0 8px rgba(255, 42, 42, 0.3); }

    /* Progress Bars (Text based) */
    .prog-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      border-bottom: 1px solid #222;
      padding-bottom: 8px;
    }
    .prog-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .prog-lvl { color: #fff; font-weight: 600; }
    .prog-nums { font-family: var(--font-tech); color: var(--text-muted); }
    .prog-nums b { color: var(--primary-red); }

    /* Blog List */
    .full-width { grid-column: 1 / -1; }
    
    .pending-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .pending-item {
      background: #111;
      border-left: 3px solid #ffa500;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .pending-info h4 { margin: 0; color: #e0e0e0; font-size: 1rem; }
    .pending-info p { margin: 5px 0 0 0; color: #777; font-size: 0.85rem; font-style: italic; }
    .status-badge {
      background: rgba(255, 165, 0, 0.15);
      color: #ffa500;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: bold;
      border: 1px solid rgba(255, 165, 0, 0.3);
    }

    .loading-screen { height: 100vh; display: flex; justify-content: center; align-items: center; background: #000; color: var(--primary-red); font-family: var(--font-tech); }
    .error-msg { color: var(--primary-red); padding: 20px; border: 1px solid var(--primary-red); background: rgba(255, 0, 0, 0.1); }
  `;

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading-screen">INITIALIZING PROFILE...</div>
    </>
  );

  if (errorMsg) return (
    <div className="profile-page" style={{ background: "#050505" }}>
      <style>{styles}</style>
      <div className="error-msg">{errorMsg}</div>
    </div>
  );

  if (!user) return null;

  // Helpers
  const totalBlogs = blogs.length;
  const verifiedBlogs = blogs.filter((b) => b.status === "verified");
  const pendingBlogs = blogs.filter((b) => b.status === "pending");
  const rejectedBlogs = blogs.filter((b) => b.status === "rejected");

  const prog = user.phishingProgress || {};
  const beginner = prog.beginner || {};
  const medium = prog.medium || {};
  const pro = prog.pro || {};

  return (
    <div 
      className="profile-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <style>{styles}</style>

      <h1 className="page-title">User <span style={{color: '#ff2a2a'}}>Identity</span></h1>

      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: Identity Card */}
        <div className="cyber-card">
          <div className="card-title">👤 Personal Data</div>
          
          <div className="identity-wrapper">
            <div className="profile-pic-container">
              <img
                src={
                  user.profilePic
                    ? user.profilePic
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="profile-pic"
              />
            </div>
            
            <div className="user-details">
              <h3>{user.name}</h3>
              <p className="email">{user.email}</p>
              <div style={{ marginTop: '10px', display: 'flex', gap: '15px' }}>
                 <div>
                    <span style={{color: '#666', fontSize: '0.8rem'}}>POINTS</span>
                    <div style={{color: '#ff2a2a', fontWeight: 'bold', fontSize: '1.1rem'}}>{user.points || 0}</div>
                 </div>
                 <div>
                    <span style={{color: '#666', fontSize: '0.8rem'}}>REPORTS</span>
                    <div style={{color: '#fff', fontWeight: 'bold', fontSize: '1.1rem'}}>{user.reportsCount || 0}</div>
                 </div>
              </div>
            </div>
          </div>

          <div className="upload-section">
            <label style={{color: '#888', fontSize: '0.85rem', marginBottom: '8px', display: 'block'}}>Update Avatar</label>
            <div className="file-input-wrapper">
              <label className="custom-file-label">
                {imageFile ? imageFile.name : "📁 Select Image..."}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImageFile(e.target.files[0])} 
                  style={{display: 'none'}}
                />
              </label>
              <button 
                className="upload-btn" 
                onClick={handleUploadProfilePic} 
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Stats & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Blog Summary */}
          <div className="cyber-card">
            <div className="card-title">📝 Content Stats</div>
            <div className="stats-container">
              <div className="stat-box">
                <span className="stat-label">Total Posts</span>
                <span className="stat-value">{totalBlogs}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Verified</span>
                <span className="stat-value highlight">{verifiedBlogs.length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Pending</span>
                <span className="stat-value" style={{color: 'orange'}}>{pendingBlogs.length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Rejected</span>
                <span className="stat-value" style={{color: '#555'}}>{rejectedBlogs.length}</span>
              </div>
            </div>
          </div>

          {/* Simulator Progress */}
          <div className="cyber-card">
            <div className="card-title">🎯 Simulation Metrics</div>
            <div style={{ padding: '0 10px' }}>
              <div className="prog-row">
                <span className="prog-lvl">Beginner</span>
                <span className="prog-nums"><b>{beginner.correct || 0}</b> / {beginner.total || 100}</span>
              </div>
              <div className="prog-row">
                <span className="prog-lvl">Medium</span>
                <span className="prog-nums"><b>{medium.correct || 0}</b> / {medium.total || 50}</span>
              </div>
              <div className="prog-row">
                <span className="prog-lvl">Pro</span>
                <span className="prog-nums"><b>{pro.correct || 0}</b> / {pro.total || 50}</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM FULL WIDTH: Pending Logs */}
        <div className="cyber-card full-width">
          <div className="card-title">⏳ Pending Approvals</div>
          
          {pendingBlogs.length === 0 ? (
            <div style={{textAlign: 'center', color: '#666', padding: '20px', fontStyle: 'italic'}}>
              No pending content in queue.
            </div>
          ) : (
            <div className="pending-list">
              {pendingBlogs.map((blog) => (
                <div key={blog._id} className="pending-item">
                  <div className="pending-info">
                    <h4>{blog.title}</h4>
                    {blog.subtitle && <p>{blog.subtitle}</p>}
                  </div>
                  <span className="status-badge">{blog.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}