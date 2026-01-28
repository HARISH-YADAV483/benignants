import { useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import bg from "../assets/backfround.jpeg"; // Ensure this matches your file path

export default function CreateBlog() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    body: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ upload image to backend -> cloudinary
  const handleUploadImage = async () => {
    try {
      if (!imageFile) return;

      setUploading(true);
      setErrorMsg("");

      const fd = new FormData();
      fd.append("image", imageFile);

      const res = await axios.post("http://localhost:5001/api/upload/image", fd, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadedImageUrl(res.data.url);
    } catch (err) {
      console.log(err);
      setErrorMsg(err?.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccessMsg("");
      setErrorMsg("");

      // ✅ Create blog payload
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        body: form.body,
        images: uploadedImageUrl ? [uploadedImageUrl] : [],
      };

      await axios.post("http://localhost:5001/api/blogs", payload, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setSuccessMsg("✅ Report submitted! Awaiting admin verification.");

      setTimeout(() => {
        navigate("/blogs");
      }, 1200);
    } catch (err) {
      console.log(err);
      setErrorMsg(err?.response?.data?.message || "Failed to submit blog.");
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

    .create-page {
      min-height: 100vh;
      color: var(--text-main);
      font-family: var(--font-main);
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .form-card {
      background: var(--card-bg);
      width: 100%;
      max-width: 700px;
      padding: 40px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      border-top: 4px solid var(--primary-red);
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      backdrop-filter: blur(10px);
      animation: fadeIn 0.4s ease-out;
    }

    .page-title {
      font-size: 2rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0 0 10px 0;
      text-align: center;
    }
    .page-title span { color: var(--primary-red); }

    .page-desc {
      text-align: center;
      color: var(--text-muted);
      margin-bottom: 30px;
      font-family: var(--font-tech);
      font-size: 0.9rem;
    }

    /* Form Fields */
    .form-group {
      margin-bottom: 20px;
    }

    .input-field, .textarea-field {
      width: 100%;
      padding: 14px;
      background: #0a0a0a;
      border: 1px solid #333;
      color: #fff;
      border-radius: 4px;
      font-family: var(--font-tech);
      box-sizing: border-box;
      transition: all 0.3s;
    }
    .input-field:focus, .textarea-field:focus {
      border-color: var(--primary-red);
      outline: none;
      box-shadow: 0 0 10px rgba(255, 42, 42, 0.2);
    }
    .textarea-field {
      height: 200px;
      resize: vertical;
      line-height: 1.5;
    }

    /* Upload Section */
    .upload-section {
      background: #111;
      padding: 20px;
      border: 1px dashed #444;
      border-radius: 6px;
      margin-top: 10px;
    }

    .upload-label {
      display: block;
      margin-bottom: 10px;
      color: #ccc;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .file-input-wrapper {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .upload-btn {
      background: #333;
      border: 1px solid #555;
      color: #fff;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 1px;
      transition: all 0.3s;
    }
    .upload-btn:hover:not(:disabled) {
      background: #fff;
      color: #000;
    }
    .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Preview */
    .preview-box {
      margin-top: 15px;
      border-top: 1px solid #333;
      padding-top: 15px;
    }
    .preview-text { color: var(--text-muted); font-size: 0.8rem; margin-bottom: 10px; }
    .preview-img {
      width: 100%;
      max-width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid var(--primary-red);
    }

    /* Submit Button */
    .submit-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #990000, #ff2a2a);
      border: none;
      color: white;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 20px;
      font-size: 1rem;
      transition: all 0.3s;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(255, 42, 42, 0.4);
    }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; background: #444; }

    /* Messages */
    .msg-box {
      text-align: center;
      padding: 10px;
      margin-bottom: 20px;
      border-radius: 4px;
      font-weight: bold;
    }
    .msg-success { background: rgba(0, 255, 0, 0.1); color: #0f0; border: 1px solid #0f0; }
    .msg-error { background: rgba(255, 0, 0, 0.1); color: #f00; border: 1px solid #f00; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* Mobile */
    @media (max-width: 600px) {
      .form-card { padding: 25px; }
      .page-title { font-size: 1.5rem; }
      .file-input-wrapper { flex-direction: column; align-items: stretch; }
      .file-input-wrapper input { margin-bottom: 10px; }
    }
  `;

  return (
    <div 
      className="create-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <style>{styles}</style>

      <div className="form-card">
        <h1 className="page-title">Submit <span>Intel Report</span></h1>
        <p className="page-desc">SECURE UPLINK ESTABLISHED. ENTER DATA BELOW.</p>

        {successMsg && <div className="msg-box msg-success">{successMsg}</div>}
        {errorMsg && <div className="msg-box msg-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <input
              name="title"
              placeholder="REPORT TITLE / SUBJECT"
              value={form.title}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <input
              name="subtitle"
              placeholder="SUBTITLE / CONTEXT (OPTIONAL)"
              value={form.subtitle}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <textarea
              name="body"
              placeholder="ENTER DETAILED ANALYSIS..."
              value={form.body}
              onChange={handleChange}
              required
              className="textarea-field"
            />
          </div>

          {/* Upload Section */}
          <div className="upload-section">
            <label className="upload-label">ATTACH VISUAL EVIDENCE:</label>
            
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                style={{ color: '#fff' }}
              />

              <button
                type="button"
                className="upload-btn"
                onClick={handleUploadImage}
                disabled={!imageFile || uploading}
              >
                {uploading ? "UPLOADING..." : "UPLOAD TO SERVER"}
              </button>
            </div>

            {/* Preview */}
            {uploadedImageUrl && (
              <div className="preview-box">
                <p className="preview-text">✅ ASSET SECURED:</p>
                <img
                  src={uploadedImageUrl}
                  alt="preview"
                  className="preview-img"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? "ENCRYPTING & SENDING..." : "TRANSMIT REPORT"}
          </button>

        </form>
      </div>
    </div>
  );
}