import { useState } from "react";
import { loginUser } from "../services/authService";
import { saveAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import bg from "../assets/backfround.jpeg"; // Added to match your other pages

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(form);

      alert(res.data.message);

      // ✅ save token + user
      saveAuth(res.data.token, res.data.user);

      if (res.data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
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
      --text-main: #ffffff;
      --text-muted: #888888;
      --font-tech: 'Courier New', monospace;
      --font-main: 'Inter', sans-serif;
    }

    .login-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background-size: cover;
      background-position: center;
      font-family: var(--font-main);
    }

    .login-card {
      background: var(--card-bg);
      width: 100%;
      max-width: 400px;
      padding: 40px;
      border-radius: 8px;
      border: 1px solid #333;
      border-left: 4px solid var(--primary-red);
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
      backdrop-filter: blur(5px);
      animation: fadeIn 0.5s ease-out;
    }

    .login-title {
      color: var(--text-main);
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 1.8rem;
      margin-bottom: 30px;
      text-align: center;
      border-bottom: 1px solid #333;
      padding-bottom: 15px;
    }
    .login-title span { color: var(--primary-red); }

    .form-group {
      margin-bottom: 20px;
    }

    .custom-input {
      width: 100%;
      padding: 14px;
      background: #0a0a0a;
      border: 1px solid #333;
      color: #fff;
      border-radius: 4px;
      font-family: var(--font-tech);
      box-sizing: border-box; /* Important for responsive width */
      transition: all 0.3s ease;
    }

    .custom-input:focus {
      outline: none;
      border-color: var(--primary-red);
      box-shadow: 0 0 10px rgba(255, 42, 42, 0.2);
    }

    .login-btn {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #cc0000 0%, #ff2a2a 100%);
      border: none;
      color: white;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
      transition: all 0.3s ease;
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(255, 42, 42, 0.4);
    }

    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #444;
    }

    .login-footer {
      margin-top: 25px;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .login-link {
      color: var(--primary-red);
      text-decoration: none;
      font-weight: bold;
      transition: color 0.2s;
    }
    .login-link:hover {
      color: #fff;
      text-decoration: underline;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Mobile Tweaks */
    @media (max-width: 480px) {
      .login-card { padding: 30px 20px; }
      .login-title { font-size: 1.5rem; }
    }
  `;

  return (
    <div 
      className="login-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${bg})`
      }}
    >
      <style>{styles}</style>

      <div className="login-card">
        <h1 className="login-title">🔐 System <span>Access</span></h1>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              name="email"
              type="email"
              placeholder="ENTER EMAIL"
              value={form.email}
              onChange={handleChange}
              required
              className="custom-input"
            />
          </div>

          <div className="form-group">
            <input
              name="password"
              type="password"
              placeholder="ENTER PASSWORD"
              value={form.password}
              onChange={handleChange}
              required
              className="custom-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>

          <p className="login-footer">
            New agent?{" "}
            <a href="/register" className="login-link">
              Create secure account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}