import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../config/api";
import "./LessonDetail.css";

const LessonDetail = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [lessonDetails, setLessonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // First fetch basic lesson info
    fetch(`${API.baseUrl}/getLessonDetails/${lessonId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Lesson not found');
        }
        return response.json();
      })
      .then(lessonData => {
        setLesson(lessonData);
        
        // Then fetch lesson details
        return fetch(`${API.baseUrl}/getLessonDetails/${lessonId}`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Lesson details not found');
        }
        return response.json();
      })
      .then(detailsData => {
        setLessonDetails(detailsData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading lesson:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [lessonId]);

  const renderComponent = (component, index) => {
    switch (component.type) {
      case 'text':
        return <p key={index} className="component-text">{component.content}</p>;
        
      case 'image':
        return (
          <figure key={index} className="component-image">
            <img src={component.url} alt={component.caption || 'Lesson image'} />
            {component.caption && <figcaption>{component.caption}</figcaption>}
          </figure>
        );
        
      case 'code':
        return (
          <div key={index} className="component-code">
            <div className="code-language">{component.language}</div>
            <pre><code>{component.content}</code></pre>
          </div>
        );
        
      default:
        return <div key={index}>Unsupported component type: {component.type}</div>;
    }
  };

  if (loading) return <div className="lesson-loading">Loading lesson...</div>;
  if (error) return <div className="lesson-error">Error: {error}</div>;
  if (!lesson || !lessonDetails) return <div className="lesson-not-found">Lesson not found</div>;

  return (
    <div className="lesson-detail-container">
      <div className="lesson-header" style={{ backgroundImage: `url(${lesson.image})` }}>
        <div className="lesson-header-overlay">
          <h1>{lesson.title}</h1>
          <div className="lesson-progress">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${lesson.progress}%` }}></div>
              <span>{lesson.progress}% complete</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lesson-body">
        <div className="lesson-content">
          {lessonDetails.components.map((component, index) => 
            renderComponent(component, index)
          )}
        </div>
        
        <div className="lesson-actions">
          <button className="start-lesson-btn">
            {lesson.progress > 0 ? 'Continue Lesson' : 'Start Lesson'}
          </button>
          <Link to="/lessons" className="back-btn">Back to Lessons</Link>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;