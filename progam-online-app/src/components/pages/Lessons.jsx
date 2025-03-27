import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Lessons.css";
import API from "../../config/api";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API.baseUrl}/getLessons`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch lessons');
        }
        return response.json();
      })
      .then(data => {
        setLessons(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching lessons:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="lessons-loading">Loading lessons...</div>;
  if (error) return <div className="lessons-error">Error: {error}</div>;

  return (
    <div className="lessons-container">
      <h1 className="lessons-title">My Lessons</h1>
      {lessons.length === 0 ? (
        <p className="no-lessons">No lessons available at the moment.</p>
      ) : (
        <div className="lessons-grid">
          {lessons.map((lesson) => (
            <Link to={`/lesson/${lesson.id}`} key={lesson.id} className="lesson-card">
              <div 
                className="lesson-image" 
                style={{ backgroundImage: `url(${lesson.image})` }}
              ></div>
              <div className="lesson-content">
                <h3>{lesson.title}</h3>
                <div className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${lesson.progress}%` }}
                  ></div>
                  <span>{lesson.progress}% complete</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lessons;