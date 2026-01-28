import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/userService";
import bg from "../assets/backfround.jpeg"; // Ensure spelling matches your file

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getLeaderboard()
      .then((res) => setUsers(res.data || []))
      .catch((err) => {
        console.log(err);
        alert("Failed to load leaderboard");
      });
  }, []);

  // --- STYLES ---
  const styles = `
    :root {
      --bg-dark: #050505;
      --card-bg: rgba(22, 22, 22, 0.9);
      --border-color: #333;
      --primary-red: #ff2a2a;
      --gold: #ffd700;
      --silver: #c0c0c0;
      --bronze: #cd7f32;
      --text-main: #e0e0e0;
      --text-muted: #777;
      --font-tech: 'Courier New', monospace;
      --font-main: 'Inter', sans-serif;
    }

    .leaderboard-page {
      min-height: 100vh;
      color: var(--text-main);
      font-family: var(--font-main);
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .page-title {
      font-size: 2.5rem;
      text-transform: uppercase;
      letter-spacing: 4px;
      border-bottom: 2px solid var(--primary-red);
      padding-bottom: 10px;
      margin-bottom: 10px;
      text-shadow: 0 0 15px rgba(255, 42, 42, 0.6);
      text-align: center;
    }

    .legend-box {
      background: rgba(0,0,0,0.6);
      border: 1px dashed #444;
      padding: 10px 20px;
      border-radius: 4px;
      margin-bottom: 30px;
      font-size: 0.9rem;
      color: #aaa;
      font-family: var(--font-tech);
      text-align: center;
    }
    .legend-box span { color: var(--primary-red); font-weight: bold; }

    /* List Container */
    .list-container {
      width: 100%;
      max-width: 900px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    /* User Card */
    .user-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      padding: 15px 20px;
      border-radius: 8px;
      display: grid;
      grid-template-columns: 60px auto 1fr 100px; /* Rank | Profile | Stats | Points */
      align-items: center;
      gap: 20px;
      transition: transform 0.2s, box-shadow 0.2s;
      backdrop-filter: blur(5px);
    }
    
    .user-card:hover {
      transform: translateX(5px);
      border-color: #555;
      box-shadow: 0 5px 20px rgba(0,0,0,0.5);
    }

    /* Rank Styles */
    .rank-box {
      font-size: 1.5rem;
      font-weight: 800;
      color: #444;
      font-family: var(--font-tech);
      text-align: center;
    }
    
    /* Top 3 Highlighting */
    .user-card.rank-1 { border-left: 4px solid var(--gold); background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent); }
    .user-card.rank-1 .rank-box { color: var(--gold); text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
    
    .user-card.rank-2 { border-left: 4px solid var(--silver); }
    .user-card.rank-2 .rank-box { color: var(--silver); }
    
    .user-card.rank-3 { border-left: 4px solid var(--bronze); }
    .user-card.rank-3 .rank-box { color: var(--bronze); }

    /* Profile Section */
    .profile-section {
      display: flex;
      align-items: center;
      gap: 15px;
      min-width: 200px;
    }
    
    .profile-pic {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #444;
    }
    .user-card.rank-1 .profile-pic { border-color: var(--gold); }

    .user-info h3 { margin: 0; font-size: 1.1rem; color: #fff; }
    .user-info p { margin: 2px 0 0 0; font-size: 0.8rem; color: var(--text-muted); max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Stats Breakdown (Middle) */
    .stats-breakdown {
      display: flex;
      gap: 15px;
      justify-content: center;
    }
    .stat-pill {
      background: #111;
      border: 1px solid #333;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-family: var(--font-tech);
      color: #888;
      text-align: center;
      min-width: 60px;
    }
    .stat-pill b { display: block; color: #fff; font-size: 0.9rem; }
    .stat-pill span { font-size: 0.65rem; text-transform: uppercase; }

    /* Total Points (Right) */
    .points-box {
      text-align: right;
    }
    .points-val {
      font-size: 1.4rem;
      font-weight: bold;
      color: var(--primary-red);
      font-family: var(--font-tech);
    }
    .points-lbl { font-size: 0.7rem; color: #666; text-transform: uppercase; }

    /* Responsive Mobile Design */
    @media (max-width: 768px) {
      .user-card {
        grid-template-columns: 50px 1fr auto; /* Rank | Profile | Points */
        grid-template-rows: auto auto;
        padding: 15px;
        gap: 10px;
      }
      
      .rank-box { font-size: 1.2rem; }
      
      .stats-breakdown {
        grid-column: 1 / -1; /* Span full width on row 2 */
        justify-content: space-between;
        margin-top: 5px;
        border-top: 1px solid #222;
        padding-top: 10px;
      }
      
      .stat-pill { flex: 1; }
      
      .profile-section { min-width: auto; }
      .user-info p { max-width: 120px; }
    }
  `;

  return (
    <div 
      className="leaderboard-page"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <style>{styles}</style>

      <h1 className="page-title">🏆 Top Agents</h1>

      <div className="legend-box">
        Mission Value: <span>Beginner +1</span> | <span>Medium +3</span> | <span>Pro +6</span>
      </div>

      <div className="list-container">
        {users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed #333', color: '#666' }}>
            No agents found in database.
          </div>
        ) : (
          users.map((u, i) => {
            const rank = i + 1;
            let rankClass = "";
            if (rank === 1) rankClass = "rank-1";
            if (rank === 2) rankClass = "rank-2";
            if (rank === 3) rankClass = "rank-3";

            return (
              <div key={u._id} className={`user-card ${rankClass}`}>
                
                {/* 1. Rank */}
                <div className="rank-box">
                  #{rank}
                </div>

                {/* 2. Profile Info */}
                <div className="profile-section">
                  <img
                    src={
                      u.profilePic && u.profilePic !== ""
                        ? u.profilePic
                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="profile"
                    className="profile-pic"
                  />
                  <div className="user-info">
                    <h3>{u.name}</h3>
                    <p title={u.email}>{u.email}</p>
                  </div>
                </div>

                {/* 3. Detailed Stats (Middle) */}
                <div className="stats-breakdown">
                  <div className="stat-pill">
                    <span>Beginner</span>
                    <b>{u.phishingProgress?.beginner?.correct || 0}</b>
                  </div>
                  <div className="stat-pill">
                    <span>Medium</span>
                    <b>{u.phishingProgress?.medium?.correct || 0}</b>
                  </div>
                  <div className="stat-pill">
                    <span>Pro</span>
                    <b>{u.phishingProgress?.pro?.correct || 0}</b>
                  </div>
                </div>

                {/* 4. Total Points (Right) */}
                <div className="points-box">
                  <div className="points-val">{u.points || 0}</div>
                  <div className="points-lbl">PTS</div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}