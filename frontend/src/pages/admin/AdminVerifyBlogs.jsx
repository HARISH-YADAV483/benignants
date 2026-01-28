import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../../utils/auth";

export default function AdminVerifyBlogs() {
  const user = getUser();

  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingBlogs = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/blogs/admin/pending", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setPendingBlogs(res.data || []);
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to load pending blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  const handleVerify = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/blogs/admin/verify/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      alert("✅ Blog Verified!");
      fetchPendingBlogs();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Verify failed");
    }
  };

  const handleReject = async (id) => {
    try {
      const adminNote = prompt("Enter rejection reason (optional):") || "Rejected";

      await axios.put(
        `http://localhost:5001/api/blogs/admin/reject/${id}`,
        { adminNote },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      alert("❌ Blog Rejected!");
      fetchPendingBlogs();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Reject failed");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>❌ Admin access only</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading pending blogs...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛡️ Admin Blog Verification</h1>
      <p style={{ color: "#555" }}>
        Pending blogs submitted by users (verify/reject).
      </p>

      {pendingBlogs.length === 0 ? (
        <h3>✅ No pending blogs right now.</h3>
      ) : (
        pendingBlogs.map((blog) => (
          <div
            key={blog._id}
            style={{
              marginTop: "15px",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <h2 style={{ marginBottom: "5px" }}>{blog.title}</h2>

            {blog.subtitle && (
              <p style={{ marginTop: "5px", fontStyle: "italic", color: "#444" }}>
                {blog.subtitle}
              </p>
            )}

            <p style={{ color: "#666", fontSize: "13px" }}>
              ✍️ By: <b>{blog.author?.name}</b> ({blog.author?.email})
            </p>

            <p style={{ marginTop: "10px" }}>
              {blog.body?.slice(0, 200)}...
            </p>

            {blog.images?.length > 0 && (
              <img
                src={blog.images[0]}
                alt="preview"
                style={{
                  marginTop: "10px",
                  width: "100%",
                  maxWidth: "450px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                }}
              />
            )}

            <div style={{ marginTop: "12px" }}>
              <button
                onClick={() => handleVerify(blog._id)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  marginRight: "10px",
                  background: "green",
                  color: "white",
                  border: "none",
                }}
              >
                ✅ Verify
              </button>

              <button
                onClick={() => handleReject(blog._id)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  background: "red",
                  color: "white",
                  border: "none",
                }}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}