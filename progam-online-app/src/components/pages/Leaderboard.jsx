import { useState, useEffect } from "react";
import "./Leaderboard.css";
import API from "../../config/api";

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetch(API.getUrl(API.endpoints.leaderboard))
      .then(response => response.json())
      .then(data => setLeaderboardData(data))
      .catch(error => console.error('Error fetching leaderboard:', error));
  }, []);

  const getRankClass = (rank) => {
    if (rank === 1) return "rank-1";
    if (rank === 2) return "rank-2";
    if (rank === 3) return "rank-3";
    return "rank-other";
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">Class Leaderboard</h1>
        <p className="leaderboard-subtitle">Top performers in programming challenges and exercises</p>
      </div>

      <div className="leaderboard-grid">
        {leaderboardData.map((player) => (
          <div key={player.id} className={`leaderboard-row ${player.name === "Farhan" ? "highlighted" : ""}`}>
            <div className="player-info">
              <div className={`rank ${getRankClass(player.id)}`}>
                {player.id}
              </div>
              <span className="player-name">{player.name}</span>
            </div>
            <div className="player-stats">
              <div className="stat">
                <div className="stat-label">Lessons completed</div>
                <div className="stat-value">{player.completedLessons}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Streak</div>
                <div className="stat-value">{player.streak} days</div>
              </div>
              <div className="score">{player.score}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;