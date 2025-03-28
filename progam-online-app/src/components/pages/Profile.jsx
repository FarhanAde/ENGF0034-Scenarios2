import { useState, useEffect } from 'react';
import './Profile.css';
import API from "../../config/api";

const Profile = () => {
  const userId = 2; // Farhan's ID in the leaderboard
  const [userData, setUserData] = useState(null);
  const [problemsData, setProblemsData] = useState({ solved: [], total: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch leaderboard data to get Farhan's info
        const leaderboardResponse = await fetch(`${API.baseUrl}/getLeaderboard`);
        if (!leaderboardResponse.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        
        const leaderboardData = await leaderboardResponse.json();
        
        // Find Farhan by ID
        const farhanData = leaderboardData.find(user => user.id === userId);
        
        if (!farhanData) {
          throw new Error(`User with ID ${userId} not found in leaderboard`);
        }
        
        // Set user data from leaderboard entry
        setUserData({
          id: farhanData.id,
          name: farhanData.name,
          username: "farhan.adey", // Add static username since it's not in leaderboard
          email: "farhan.adeyemo.24@ucl.ac.uk", // Add static email since it's not in leaderboard
          role: "Student",
          avatar: farhanData.avatar,
          score: farhanData.score,
          rank: leaderboardData.findIndex(user => user.id === userId) + 1, // Calculate rank
          completedLessons: farhanData.completedLessons,
          problemsSolved: farhanData.problemsSolved,
          points: farhanData.points,
          streak: farhanData.streak
        });
        
        // Fetch problems data
        const problemsResponse = await fetch(`${API.baseUrl}/getProblems`);
        if (!problemsResponse.ok) {
          throw new Error('Failed to fetch problems data');
        }
        
        const problemsData = await problemsResponse.json();
        const totalProblems = problemsData.length;
        
        // Get a subset of problems that matches the count from leaderboard
        const solvedCount = Math.min(farhanData.problemsSolved, problemsData.length);
        const solvedProblems = problemsData
          .slice(0, solvedCount)
          .map(problem => ({
            id: problem.id,
            title: problem.title,
            difficulty: problem.difficulty
          }));
          
        setProblemsData({
          solved: solvedProblems,
          total: totalProblems
        });
        
        // Generate recent activity based on solved problems
        const recentActivities = solvedProblems.slice(0, 5).map(problem => ({
          type: "solved_problem",
          problem: problem.title,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          points: problem.difficulty === "Easy" ? 5 : problem.difficulty === "Medium" ? 10 : 15
        }));
        
        // Add some forum activities
        recentActivities.push({
          type: "forum_post",
          title: "Question about binary search",
          timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
        });
        
        // Add some lesson progress based on completedLessons
        recentActivities.push({
          type: "lesson_progress",
          lesson: "Python Basics",
          progress: 85,
          timestamp: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
        });
        
        recentActivities.push({
          type: "lesson_progress",
          lesson: "Data Structures",
          progress: 60,
          timestamp: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
        });
        
        // Sort by timestamp (newest first)
        recentActivities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setRecentActivity(recentActivities);
        
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Format the date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Function to render different activity types
  const renderActivity = (activity) => {
    switch (activity.type) {
      case 'solved_problem':
        return (
          <div className="activity-item problem-solved">
            <div className="activity-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <div className="activity-details">
              <div className="activity-title">Solved problem: {activity.problem}</div>
              <div className="activity-timestamp">{formatDate(activity.timestamp)}</div>
              <div className="activity-points">+{activity.points} points</div>
            </div>
          </div>
        );
      // case 'forum_post':
      //   return (
      //     <div className="activity-item forum-post">
      //       <div className="activity-icon">
      //         <i className="bi bi-chat-left-text-fill"></i>
      //       </div>
      //       <div className="activity-details">
      //         <div className="activity-title">Posted on forum: {activity.title}</div>
      //         <div className="activity-timestamp">{formatDate(activity.timestamp)}</div>
      //       </div>
      //     </div>
      //   );
      case 'lesson_progress':
        return (
          <div className="activity-item lesson-progress">
            <div className="activity-icon">
              <i className="bi bi-journal-check"></i>
            </div>
            <div className="activity-details">
              <div className="activity-title">Updated progress on: {activity.lesson}</div>
              <div className="activity-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${activity.progress}%`}}
                  ></div>
                </div>
                <span>{activity.progress}%</span>
              </div>
              <div className="activity-timestamp">{formatDate(activity.timestamp)}</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile data...</div>;
  }

  if (error) {
    return <div className="profile-error">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="profile-error">Error: User data not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={userData.avatar} alt={`${userData.name}'s avatar`} />
        </div>
        <div className="profile-info">
          <h1>{userData.name}</h1>
          <p className="username">@{userData.username}</p>
          <p className="role">{userData.role}</p>
          <p className="email">{userData.email}</p>
        </div>
      </div>

      <div className="profile-statistics">
        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-trophy-fill"></i></div>
          <div className="stat-info">
            <div className="stat-value">{userData.points}</div>
            <div className="stat-label">Points</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-bar-chart-fill"></i></div>
          <div className="stat-info">
            <div className="stat-value">{userData.rank}</div>
            <div className="stat-label">Rank</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-lightning-fill"></i></div>
          <div className="stat-info">
            <div className="stat-value">{userData.streak} days</div>
            <div className="stat-label">Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-book-fill"></i></div>
          <div className="stat-info">
            <div className="stat-value">{userData.completedLessons}</div>
            <div className="stat-label">Lessons Completed</div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Solved Problems ({userData.problemsSolved})</h2>
          {problemsData.solved.length > 0 ? (
            <div className="problems-grid">
              {problemsData.solved.slice(0, 6).map(problem => (
                <div key={problem.id} className={`problem-card ${problem.difficulty.toLowerCase()}`}>
                  <h3>{problem.title}</h3>
                  <span className="difficulty">{problem.difficulty}</span>
                </div>
              ))}
              {userData.problemsSolved > 6 && (
                <div className="problem-card more">
                  <h3>+{userData.problemsSolved - 6} more</h3>
                </div>
              )}
            </div>
          ) : (
            <p className="empty-state">No problems solved yet.</p>
          )}
        </div>

        <div className="profile-section">
          <h2>Recent Activity</h2>
          <div className="activity-feed">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="activity-container">
                  {renderActivity(activity)}
                </div>
              ))
            ) : (
              <p className="empty-state">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;