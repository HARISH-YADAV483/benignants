import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { getUser, logout } from "./utils/auth";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PasswordTool from "./pages/passwordTool";
import PhishingSimulator from "./pages/PhishingSimulator";
import ScamSearch from "./pages/ScamSearch";
import ReportScam from "./pages/ReportScam";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import CreateBlog from "./pages/CreateBlog";
import Leaderboard from "./pages/Leaderboard";
import ScreenshotAnalyzer from "./pages/ScreenshotAnalyzer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVerifyBlogs from "./pages/admin/AdminVerifyBlogs";
import ProtectedRoute from "./components/common/ProtectedRoute";

import logo from "./assets/scamshield-logo.png";

export default function App() {
  const user = getUser();

  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="ScamShield" className="nav-logo" />
        </Link>

        <div className="nav-links">
          <Link to="/leaderboard">🏆 Leaderboard</Link>

          {user && <Link to="/profile">👤 Profile</Link>}

          {!user ? (
            <Link to="/login" className="nav-btn">Login</Link>
          ) : (
            <button
              className="nav-btn logout"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/password-tool" element={<PasswordTool />} />
        <Route path="/phishing" element={<ProtectedRoute><PhishingSimulator /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><ScamSearch /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportScam /></ProtectedRoute>} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/screenshot-analyzer" element={<ScreenshotAnalyzer />} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/blogs" element={<ProtectedRoute role="admin"><AdminVerifyBlogs /></ProtectedRoute>} />
      </Routes>

      <style>{`
        .navbar {
          padding: 14px 20px;
          background: #0b0b0b;
          border-bottom: 1px solid rgba(255,255,255,0.6);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .nav-logo {
          height: 40px;
        }

        .nav-links {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .nav-links a {
          color: #fff;
          text-decoration: none;
          font-weight: 600;
        }

        .nav-btn {
          border: 1px solid #ff3b3b;
          padding: 7px 14px;
          border-radius: 10px;
          background: transparent;
          color: #fff;
          cursor: pointer;
          font-weight: 600;
        }

        .logout {
          background: #ff3b3b;
          border: none;
        }

        @media (max-width: 600px) {
          .navbar {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </BrowserRouter>
  );
}