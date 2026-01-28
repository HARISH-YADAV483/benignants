import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import bg from "../assets/backfround.jpeg"; // Ensure this path matches your project

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      setLoading(true);

      // ✅ FIXED PORT: 5001 (your backend runs on 5001)
      const res = await axios.get(`http://localhost:5001/api/blogs/${id}`);

      setBlog(res.data);
    } catch (err) {
      console.log(err);
      setBlog(null);
      alert(err?.response?.data?.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

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

    .details-page {
      min-height: 100vh;
      color: var(--text-main);
      font-family: var(--font-main);
      padding: 40px 20px;
    }

    .content-container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 0 50px rgba(0,0,0,0.8);
      backdrop-filter: blur(10px);
      position: relative;
    }

    /* Back Button */
    .back-btn {
      display: inline-block;
      margin-bottom: 25px;
      color: var(--primary-red);
      text-decoration: none;
      font-family: var(--font-tech);
      font-weight: bold;
      border: 1px solid var(--primary-red);
      padding: 8px 16px;
      border-radius: 4px;
      transition: all 0.3s;
      text-transform: uppercase;
      font-size: 0.8rem;
    }
    .back-btn:hover {
      background: var(--primary-red);
      color: #000;
      box-shadow: 0 0 15px rgba(255, 42, 42, 0.4);
    }

    /* Author Section */
    .author-header {
      display: flex;
      align-items: center;
      gap: 15px;
      padding-bottom: 25px;
      border-bottom: 1px dashed #333;
      margin-bottom: 25px;
    }

    .author-img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary-red);
      box-shadow: 0 0 10px rgba(255, 42, 42, 0.2);
    }

    .author-info h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #fff;
    }

    .author-meta {
      margin: 4px 0 0 0;
      font-size: 0.85rem;
      color: var(--text-muted);
      font-family: var(--font-tech);
    }

    /* Typography */
    .article-title {
      font-size: 2.5rem;
      line-height: 1.2;
      margin: 0 0 10px 0;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .article-subtitle {
      font-size: 1.1rem;
      color: var(--primary-red);
      font-style: italic;
      margin: 0 0 30px 0;
      border-left: 3px solid var(--primary-red);
      padding-left: 15px;
    }

    /* Images */
    .image-gallery {
      margin: 30px 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .blog-img {
      width: 100%;
      max-width: 100%;
      border-radius: 4px;
      border: 1px solid #444;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    /* Body Text */
    .article-body {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #ccc;
      white-space: pre-wrap;
      font-family: 'Georgia', serif; /* Or keep sans-serif if preferred */
    }

    /* Loaders */
    .loader-box {
      min-height: 50vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: var(--font-tech);
      color: var(--primary-red);
      text-align: center;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .details-page { padding: 20px 10px; }
      .content-container { padding: 25px; }
      .article-title { font-size: 1.8rem; }
      .author-header { flex-direction: column; align-items: flex-start; }
    }
  `;

  if (loading) {
    return (
      <div className="details-page" style={{ background: "#050505" }}>
        <style>{styles}</style>
        <div className="loader-box">
          <h2>ACCESSING ARCHIVES...</h2>
          <p>DECRYPTING DATA STREAM</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="details-page" style={{ background: "#050505" }}>
        <style>{styles}</style>
        <div className="loader-box">
          <h2 style={{ color: "#fff" }}>❌ 404 DATA NOT FOUND</h2>
          <Link to="/blogs" className="back-btn" style={{ marginTop: "20px" }}>
            Return to Database
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="details-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <style>{styles}</style>

      <div className="content-container">
        
        {/* Navigation */}
        <Link to="/blogs" className="back-btn">
          ← Back to Intel Feed
        </Link>

        {/* Header Section */}
        <div className="author-header">
          <img
            src={
              blog.author?.profilePic && blog.author.profilePic !== ""
                ? blog.author.profilePic
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="author"
            className="author-img"
          />

          <div className="author-info">
            <h3>{blog.author?.name || "Unknown Agent"}</h3>
            <p className="author-meta">
              PUBLISHED: {blog.createdAt ? new Date(blog.createdAt).toLocaleString() : "UNKNOWN DATE"}
            </p>
          </div>
        </div>

        {/* Title Block */}
        <h1 className="article-title">{blog.title}</h1>
        
        {blog.subtitle && blog.subtitle.trim() !== "" && (
          <p className="article-subtitle">{blog.subtitle}</p>
        )}

        {/* Images */}
        {blog.images?.length > 0 && (
          <div className="image-gallery">
            {blog.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Evidence ${idx + 1}`}
                className="blog-img"
              />
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="article-body">
          {blog.body}
        </div>
      </div>

    </div>
  );
}