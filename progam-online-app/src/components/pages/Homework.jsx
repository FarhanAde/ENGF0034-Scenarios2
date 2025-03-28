import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../config/api";
import "./Homework.css";

const Homework = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API.baseUrl}/getHomework`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch homework assignments');
        }
        return response.json();
      })
      .then(data => {
        setAssignments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching homework:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getStatusClass = (status) => {
    switch(status) {
      case "submitted": return "status-submitted";
      case "in-progress": return "status-in-progress";
      case "not-started": return "status-not-started";
      default: return "";
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case "submitted": return "Submitted";
      case "in-progress": return "In Progress";
      case "not-started": return "Not Started";
      default: return status;
    }
  };
  
  // Format dates in dd/mm/yyyy format
  const formatDate = (dateString) => {
    // If the date is already in dd/mm/yyyy format, return it as is
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }
    
    // Otherwise, if it's in ISO format, convert it
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        // If date parsing failed, return the original string
        return dateString;
      }
      
      // Format as dd/mm/yyyy
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (e) {
      // If any error occurs, return the original string
      console.error("Date parsing error:", e);
      return dateString;
    }
  };

  if (loading) return <div className="homework-loading">Loading assignments...</div>;
  if (error) return <div className="homework-error">Error: {error}</div>;

  return (
    <div className="homework-container">
      <h1 className="homework-title">My Assignments</h1>
      
      {assignments.length === 0 ? (
        <p className="no-assignments">No assignments available at the moment.</p>
      ) : (
        <div className="homework-grid">
          {assignments.map((assignment) => (
            <Link to={`/homework/${assignment.id}`} key={assignment.id} className="assignment-card">
              <div 
                className="assignment-image" 
                style={{ backgroundImage: `url(${assignment.image})` }}
              >
                <div className={`assignment-status ${getStatusClass(assignment.status)}`}>
                  {getStatusText(assignment.status)}
                </div>
              </div>
              <div className="assignment-content">
                <h3>{assignment.title}</h3>
                <div className="assignment-details">
                  <div className="due-date">
                    <span className="label">Due:</span> 
                    <span className="value">{formatDate(assignment.dueDate)}</span>
                  </div>
                  {assignment.grade && (
                    <div className="grade">
                      <span className="label">Grade:</span>
                      <span className="value">{assignment.grade}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Homework;