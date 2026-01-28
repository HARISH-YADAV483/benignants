import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import bg from "../assets/backfround.jpeg"; // Keeping your file path

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser(form);
      alert(res.data.message);

      // ✅ move user to OTP verification page
      navigate("/login", { state: { email: form.email } });
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
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

    .reg-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      font-family: var(--font-main);
    }

    .reg-card {
      background: var(--card-bg);
      width: 100%;
      max-width: 450px;
      padding: 40px;
      border-radius: 8px;
      border: 1px solid #333;
      border-right: 4px solid var(--primary-red);
      box-shadow: 0 15px 50px rgba(0,0,0,0.8);
      backdrop-filter: blur(5px);
      animation: slideUp 0.5s ease-out;
    }

    .reg-title {
      color: var(--text-main);
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 1.8rem;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .reg-subtitle {
      color: var(--text-muted);
      text-align: center;
      margin-bottom: 30px;
      font-size: 0.9rem;
    }

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
      box-sizing: border-box;
      transition: all 0.3s ease;
    }

    .custom-input:focus {
      outline: none;
      border-color: var(--primary-red);
      background: #111;
      box-shadow: 0 0 12px rgba(255, 42, 42, 0.2);
    }

    .reg-btn {
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

    .reg-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(255, 42, 42, 0.4);
    }

    .reg-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #444;
    }

    .reg-footer {
      margin-top: 25px;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
      border-top: 1px solid #333;
      padding-top: 20px;
    }

    .reg-link {
      color: var(--primary-red);
      text-decoration: none;
      font-weight: bold;
      transition: color 0.2s;
    }
    .reg-link:hover {
      color: #fff;
      text-decoration: underline;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Mobile Responsiveness */
    @media (max-width: 480px) {
      .reg-card { padding: 30px 20px; border-right: none; border-top: 4px solid var(--primary-red); }
      .reg-title { font-size: 1.5rem; }
    }
  `;

  return (
    <div 
      className="reg-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${bg})`
      }}
    >
      <style>{styles}</style>

      <div className="reg-card">
        <h1 className="reg-title">📝 New Agent</h1>
        <p className="reg-subtitle">Join the simulation network</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input
              name="name"
              type="text"
              placeholder="FULL NAME"
              value={form.name}
              onChange={handleChange}
              required
              className="custom-input"
            />
          </div>

          <div className="form-group">
            <input
              name="email"
              type="email"
              placeholder="EMAIL ADDRESS"
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
              placeholder="CREATE PASSWORD"
              value={form.password}
              onChange={handleChange}
              required
              className="custom-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="reg-btn"
          >
            {loading ? "INITIALIZING..." : "REGISTER"}
          </button>
        </form>

        <div className="reg-footer">
          Already have an account?{" "}
          <a href="/login" className="reg-link">
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}