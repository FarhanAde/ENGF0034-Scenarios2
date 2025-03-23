import "./Leaderboard.css";

function Leaderboard() {
  const leaderboardData = [
    { id: 1, name: "Louis", score: 1578, completedLessons: 42, streak: 15 },
    { id: 2, name: "Farhan", score: 1493, completedLessons: 38, streak: 12 },
    { id: 3, name: "Licia", score: 1402, completedLessons: 35, streak: 8 },
    { id: 4, name: "Quang Loc", score: 1356, completedLessons: 33, streak: 6 },
    { id: 5, name: "Mark", score: 1298, completedLessons: 31, streak: 4 },
    { id: 6, name: "Fiona", score: 1245, completedLessons: 29, streak: 7 },
    { id: 7, name: "Yuzuko", score: 1187, completedLessons: 27, streak: 3 },
    { id: 8, name: "Max", score: 1134, completedLessons: 25, streak: 5 },
    { id: 9, name: "David", score: 1089, completedLessons: 23, streak: 2 },
    { id: 10, name: "Graham", score: 1023, completedLessons: 21, streak: 4 }
  ];

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