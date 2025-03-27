import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from "../../config/api";
import "./Practice.css";

const Practice = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [suggestedProblems, setSuggestedProblems] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [showAllProblems, setShowAllProblems] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch leaderboard
    fetch(`${API.baseUrl}/getLeaderboard`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        return response.json();
      })
      .then(data => {
        setLeaderboard(data);
        
        // Continue to fetch problems
        return fetch(`${API.baseUrl}/getProblems`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        return response.json();
      })
      .then(data => {
        // Mock selection of "suggested" problems (first 4)
        setSuggestedProblems(data.slice(0, 4));
        setAllProblems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading practice data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getDifficultyClass = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return '';
    }
  };

  if (loading) return <div className="practice-loading">Loading practice area...</div>;
  if (error) return <div className="practice-error">Error: {error}</div>;

  return (
    <div className="practice-container">
      <div className="practice-layout">
        {/* Leaderboard Section */}
        <section className="leaderboard-section">
          <div className="section-header">
            <h2>Leaderboard</h2>
            <Link to="/leaderboard" className="see-all-link">See Full Leaderboard</Link>
          </div>
          
          <div className="leaderboard-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Problems Solved</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <tr key={entry.id} className={index === 0 ? 'top-rank' : ''}>
                    <td className="rank">{index + 1}</td>
                    <td className="user">
                      <div className="user-avatar" style={{ backgroundImage: `url(${entry.avatar})` }}></div>
                      <span className="user-name">{entry.name}</span>
                    </td>
                    <td className="problems">{entry.problemsSolved}</td>
                    <td className="points">{entry.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Problems Section */}
        <section className="problems-section">
          <div className="section-header">
            <h2>Suggested Problems</h2>
            <button 
              className="toggle-problems-btn"
              onClick={() => setShowAllProblems(!showAllProblems)}
            >
              {showAllProblems ? 'Show Suggested' : 'See All Problems'}
            </button>
          </div>
          
          <div className="problems-grid">
            {(showAllProblems ? allProblems : suggestedProblems).map(problem => (
              <Link 
                to={`/practice/${problem.id}`} 
                key={problem.id} 
                className="problem-card"
              >
                <div className="problem-number">#{problem.number}</div>
                <h3 className="problem-title">{problem.title}</h3>
                <div className="problem-meta">
                  <span className={`problem-difficulty ${getDifficultyClass(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="problem-solved">
                    {problem.solvedCount} solved
                  </span>
                </div>
                <div className="problem-tags">
                  {problem.tags.map(tag => (
                    <span key={tag} className="problem-tag">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Practice;