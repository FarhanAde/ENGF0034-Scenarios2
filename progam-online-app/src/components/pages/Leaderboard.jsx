import { useState, useEffect } from "react";
import "./Leaderboard.css";

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/getLeaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        // Sort data by score in descending order
        const sortedData = [...data].sort((a, b) => b.score - a.score);
        setLeaderboardData(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const getRankClass = (rank) => {
    if (rank === 1) return "rank-1";
    if (rank === 2) return "rank-2";
    if (rank === 3) return "rank-3";
    return "rank-other";
  };

  if (isLoading) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">Class Leaderboard</h1>
          <p className="leaderboard-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">Class Leaderboard</h1>
          <p className="leaderboard-subtitle">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">Class Leaderboard</h1>
        <p className="leaderboard-subtitle">Top performers in programming challenges and exercises</p>
      </div>

      <div className="leaderboard-grid">
        {leaderboardData.map((player, index) => (
          <div key={player.id} className={`leaderboard-row ${player.name === "Farhan" ? "highlighted" : ""}`}>
            <div className="player-info">
              <div className={`rank ${getRankClass(index + 1)}`}>
                {index + 1}
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