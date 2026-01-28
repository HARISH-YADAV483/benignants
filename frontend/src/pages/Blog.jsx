import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import bg from "../assets/backfround.jpeg"; // Ensure this matches your file structure

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.get("http://localhost:5001/api/blogs");
      setBlogs(res.data || []);
    } catch (err) {
      console.log(err);
      setErrorMsg(err?.response?.data?.message || "Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((b) => {
    if (!q.trim()) return true;
    return (
      b.title?.toLowerCase().includes(q.toLowerCase()) ||
      b.subtitle?.toLowerCase().includes(q.toLowerCase()) ||
      b.body?.toLowerCase().includes(q.toLowerCase())
    );
  });

  // --- STYLES ---
  const styles = `
    :root {
      --primary-red: #ff2a2a;
      --bg-dark: #050505;
      --card-bg: #111;
      --border-color: #333;
      --text-main: #e0e0e0;
      --text-muted: #888;
      --font-tech: 'Courier New', monospace;
      --font-main: 'Inter', sans-serif;
    }

    .blog-page {
      min-height: 100vh;
      color: var(--text-main);
      font-family: var(--font-main);
      padding: 30px 20px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .page-title {
      font-size: 2.5rem;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: 10px;
      text-shadow: 0 0 15px rgba(255, 42, 42, 0.6);
    }
    .page-title span { color: var(--primary-red); }

    .page-subtitle {
      color: var(--text-muted);
      font-family: var(--font-tech);
      font-size: 0.9rem;
    }

    /* Controls Bar */
    .controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto 30px auto;
      gap: 15px;
      flex-wrap: wrap;
    }

    .search-input {
      background: #0a0a0a;
      border: 1px solid #333;
      color: #fff;
      padding: 12px 15px;
      border-radius: 4px;
      width: 100%;
      max-width: 400px;
      font-family: var(--font-tech);
      transition: all 0.3s;
    }
    .search-input:focus {
      border-color: var(--primary-red);
      outline: none;
      box-shadow: 0 0 10px rgba(255, 42, 42, 0.2);
    }

    .write-btn {
      background: linear-gradient(135deg, #990000, #ff2a2a);
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.9rem;
      transition: transform 0.2s, box-shadow 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .write-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 42, 42, 0.4);
    }

    /* Grid Layout */
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 25px;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Blog Card */
    .blog-card {
      background: rgba(20, 20, 20, 0.95);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      position: relative;
    }

    .blog-card:hover {
      border-color: #555;
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    }
    .blog-card:hover .read-more { color: var(--primary-red); }

    .card-img-container {
      height: 180px;
      overflow: hidden;
      background: #000;
      border-bottom: 1px solid #222;
    }
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
    .blog-card:hover .card-img { transform: scale(1.05); }

    .card-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    /* Author Info */
    .author-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
    }
    .author-pic {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary-red);
    }
    .author-meta h4 { margin: 0; font-size: 0.9rem; color: #fff; }
    .author-meta span { font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-tech); }

    .blog-title {
      font-size: 1.25rem;
      margin: 0 0 5px 0;
      color: #fff;
      line-height: 1.3;
    }
    .blog-subtitle {
      color: var(--primary-red);
      font-size: 0.85rem;
      font-style: italic;
      margin-bottom: 12px;
    }
    .blog-excerpt {
      font-size: 0.9rem;
      color: #aaa;
      line-height: 1.5;
      margin-bottom: 20px;
      flex: 1; /* Pushes button down */
    }

    .read-more {
      align-self: flex-start;
      color: #fff;
      text-decoration: none;
      font-weight: bold;
      font-size: 0.9rem;
      text-transform: uppercase;
      border-bottom: 2px solid var(--primary-red);
      padding-bottom: 2px;
      transition: color 0.2s;
    }

    /* States */
    .state-msg {
      text-align: center;
      padding: 40px;
      font-family: var(--font-tech);
      color: #666;
      border: 1px dashed #333;
      background: rgba(0,0,0,0.5);
      border-radius: 8px;
    }
    .error-msg { color: var(--primary-red); border-color: var(--primary-red); }

    /* Mobile Responsive */
    @media (max-width: 600px) {
      .controls-bar { flex-direction: column-reverse; align-items: stretch; }
      .search-input { max-width: 100%; }
      .write-btn { justify-content: center; }
      .page-title { font-size: 1.8rem; }
    }
  `;

  return (
    <div 
      className="blog-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.92)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <style>{styles}</style>

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Scam <span>Intel</span> Feed</h1>
        <p className="page-subtitle">Verified community reports and analysis</p>
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <input
          placeholder="🔍 Search database..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="search-input"
        />
        
        <Link to="/create-blog" className="write-btn">
          <span>✍️</span> Submit blog
        </Link>
      </div>

      {/* Content Area */}
      {loading && (
        <div className="state-msg">
          LOADING ENCRYPTED DATA...
        </div>
      )}

      {!loading && errorMsg && (
        <div className="state-msg error-msg">
          ⚠️ ERROR: {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && (
        <>
          {filteredBlogs.length === 0 ? (
            <div className="state-msg">
              NO RECORDS FOUND MATCHING QUERY.
            </div>
          ) : (
            <div className="blog-grid">
              {filteredBlogs.map((blog) => (
                <div key={blog._id} className="blog-card">
                  
                  {/* Image Section */}
                  {blog.images?.length > 0 && blog.images[0] && (
                    <div className="card-img-container">
                      <img
                        src={blog.images[0]}
                        alt="cover"
                        className="card-img"
                      />
                    </div>
                  )}

                  <div className="card-content">
                    {/* Author Section */}
                    <div className="author-row">
                      <img
                        src={
                          blog.author?.profilePic && blog.author.profilePic !== ""
                            ? blog.author.profilePic
                            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="author"
                        className="author-pic"
                      />
                      <div className="author-meta">
                        <h4>{blog.author?.name || "Unknown Agent"}</h4>
                        <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Unknown Date"}</span>
                      </div>
                    </div>

                    {/* Text Content */}
                    <h2 className="blog-title">{blog.title}</h2>
                    
                    {blog.subtitle && blog.subtitle.trim() !== "" && (
                      <p className="blog-subtitle">{blog.subtitle}</p>
                    )}

                    <p className="blog-excerpt">
                      {blog.body?.length > 120
                        ? blog.body.slice(0, 120) + "..."
                        : blog.body}
                    </p>

                    {/* Link */}
                    <Link to={`/blogs/${blog._id}`} className="read-more">
                      Read Full blog →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}


    </div>
  );
}