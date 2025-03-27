//import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css";
import codeStockImage from "../../../codeStockImage.jpg";
import moodleBanner from "../../../Moodle_Banner_02.jpg";

function Home() {
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

  const getMedalEmoji = (position) => {
    switch (position) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '';
    }
  };

  return (
    <div className="home-container">
      <h1 className="welcome-title">Welcome back</h1>
      
      <div className="content-grid">
        {/* Lesson Card */}
        <div className="card lesson-card">
          <img 
            src={codeStockImage}
            alt="Object-Oriented Programming" 
            className="lesson-thumbnail"
          />
          <a 
            href="https://www.youtube.com/watch?v=aQ8YkJrAbzE&t=74s"
            target="_blank"
            rel="noopener noreferrer"
            className="play-button"
          >
            <i className="bi bi-play-fill"></i>
          </a>
          <h2 className="card-title">Object-Oriented Programming: Interfaces</h2>
          <Link to="/lessons" className="see-more">See all lessons &gt;</Link>
        </div>

        {/* Project Card */}
        <div className="card lesson-card">
          <img 
            src={moodleBanner}
            alt="Untitled Project" 
            className="lesson-thumbnail"
          />
          <h2 className="card-title">Untitled Project</h2>
          <p className="last-edited">Last edited: 6d ago</p>
          <Link to="/projects" className="see-more">See all projects &gt;</Link>
        </div>

        {/* Leaderboard Card */}
        <div className="card leaderboard-card">
          <h2 className="leaderboard-title">Leaderboard</h2>
          {isLoading ? (
            <p>Loading leaderboard...</p>
          ) : error ? (
            <p>Error loading leaderboard: {error}</p>
          ) : (
            <ul className="leaderboard-list">
              {leaderboardData.slice(0, 3).map((player, index) => (
                <li key={player.id} className="leaderboard-item">
                  <div className="player-info">
                    <span className="medal">{getMedalEmoji(index)}</span>
                    <span>{player.name}</span>
                  </div>
                  <span className="score">{player.score}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/leaderboard" className="see-more">See full standings &gt;</Link>
        </div>
      </div>

      {/* Topic Tags */}
      <div className="topic-tags">
        <span className="topic-tag algorithms">
          <i className="bi bi-gear"></i> Algorithms
        </span>
        <span className="topic-tag kotlin">
          <i className="bi bi-phone"></i> Kotlin
        </span>
        <span className="topic-tag databases">
          <i className="bi bi-database"></i> Databases
        </span>
        <span className="topic-tag dynamic-programming">
          <i className="bi bi-graph-up"></i> Dynamic Programming
        </span>
      </div>

      {/* Learning Streak */}
      <div className="streak-container">
        <h3 className="streak-title">You&apos;re on a 12-day learning streak!</h3>
        <div className="streak-days">
          <div className="day completed">M</div>
          <div className="day completed">T</div>
          <div className="day completed">W</div>
          <div className="day completed">T</div>
          <div className="day">F</div>
          <div className="day">S</div>
          <div className="day">S</div>
        </div>
      </div>
    </div>
  );
}

export default Home;