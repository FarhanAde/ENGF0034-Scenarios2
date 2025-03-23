// import React from 'react';
import './Projects.css';

const projects = [
  {
    id: 1,
    title: 'Untitled Project',
    description: 'N/A',
    timestamp: 'Last updated on 17/03/2025',
    image: 'Moodle_Banner_02.jpg',
    tags: ['C++', 'Jupyter']
  },
  {
    id: 2,
    title: 'Weather App',
    description: 'An app that provides real-time weather updates.',
    timestamp: 'Last updated on 12/02/2025',
    image: 'codeStockImage.jpg',
    tags: ['Group project', 'backend']
  },
  {
    id: 3,
    title: 'E-commerce Platform',
    description: 'A platform for buying and selling products online.',
    timestamp: 'Last updated on 05/01/2025',
    image: 'codeStockImage.jpg',
    tags: ['frontend', 'backend']
  },
  {
    id: 4,
    title: 'AI Chatbot',
    description: 'A chatbot that uses AI to provide customer support.',
    timestamp: 'Last updated on 03/01/2025',
    image: 'codeStockImage.jpg',
    tags: ['Machine learning', 'frontend']
  },
  {
    id: 5,
    title: 'Social Media Analyzer',
    description: 'Analyzes social media trends and sentiments.',
    timestamp: 'Last updated on 20/11/2024',
    image: 'codeStockImage.jpg',
    tags: ['Machine learning', 'Python']
  },
  {
    id: 6,
    title: 'Fitness Tracker',
    description: 'Tracks fitness activities and health metrics.',
    timestamp: 'Last updated on 15/10/2024',
    image: 'codeStockImage.jpg',
    tags: ['frontend', 'React']
  },
  {
    id: 7,
    title: 'Virtual Reality Tour',
    description: 'Provides virtual tours of famous landmarks.',
    timestamp: 'Last updated on 23/09/2024',
    image: 'codeStockImage.jpg',
    tags: ['VR', 'Unity']
  }
].sort((a, b) => new Date(b.timestamp.split(' on ')[1]) - new Date(a.timestamp.split(' on ')[1]));

const Projects = () => {
  return (
    <div className="projects-container">
      <h1 className="projects-title">My Projects</h1>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <img src={project.image} alt={project.title} className="project-image" />
            <h2 className="project-title">{project.title}</h2>
            <p className="project-description">{project.description}</p>
            <p className="project-timestamp">{project.timestamp}</p>
            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className={`project-tag ${tag.toLowerCase().replace(/\s+/g, '-').replace('++', 'plusplus')}`}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;