import { useState, useEffect } from 'react';
import API from "../../config/api";
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API.baseUrl}/getProjects`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="projects-container">
        <h1 className="projects-title">My Projects</h1>
        <p className="loading-message">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-container">
        <h1 className="projects-title">My Projects</h1>
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <h1 className="projects-title">My Projects</h1>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <img 
              src={project.image} 
              alt={project.title} 
              className="project-image"
              onError={(e) => {
                e.target.src = 'Moodle_Banner_02.jpg'; // Fallback image if loading fails
              }}
            />
            <h2 className="project-title">{project.title}</h2>
            <p className="project-description">{project.description}</p>
            <p className="project-timestamp">{project.timestamp}</p>
            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className={`project-tag ${tag.toLowerCase().replace(/\s+/g, '-').replace('++', 'plusplus')}`}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;