import React, { useState, useEffect } from 'react';
import API from "../../config/api";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // In a real app, this would use authentication to get the current user's profile
    // For now, we'll just get user ID 1 as a demonstration
    fetch(`${API.baseUrl}/getProfile/1`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        return response.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading profile:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-error">Error: {error}</div>;
  if (!profile) return <div className="profile-not-found">Profile not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-email">{profile.email}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{profile.completedLessons}</span>
              <span className="stat-label">Lessons</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profile.problemsSolved}</span>
              <span className="stat-label">Problems</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profile.streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        <section className="profile-section">
          <h2 className="section-title">Progress Summary</h2>
          <div className="progress-cards">
            <div className="progress-card">
              <h3>Lessons</h3>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${(profile.completedLessons / profile.totalLessons) * 100}%` }}
                ></div>
              </div>
              <p>{profile.completedLessons} of {profile.totalLessons} completed</p>
            </div>
            <div className="progress-card">
              <h3>Practice Problems</h3>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${(profile.problemsSolved / profile.totalProblems) * 100}%` }}
                ></div>
              </div>
              <p>{profile.problemsSolved} of {profile.totalProblems} solved</p>
            </div>
            <div className="progress-card">
              <h3>Homework</h3>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${(profile.completedHomework / profile.totalHomework) * 100}%` }}
                ></div>
              </div>
              <p>{profile.completedHomework} of {profile.totalHomework} completed</p>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {profile.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <i className={`bi bi-${activity.icon}`}></i>
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2 className="section-title">Achievements</h2>
          <div className="achievements-grid">
            {profile.achievements.map((achievement, index) => (
              <div key={index} className={`achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="badge-icon">
                  <i className={`bi bi-${achievement.icon}`}></i>
                </div>
                <div className="badge-info">
                  <h3 className="badge-title">{achievement.title}</h3>
                  <p className="badge-description">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;