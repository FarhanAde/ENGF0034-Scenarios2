import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // Import the useUser hook
import API from "../../config/api";
import "./HomeworkDetail.css";

const HomeworkDetail = () => {
  const { homeworkId } = useParams();
  const { activeUser } = useUser(); // Get the active user
  const [homework, setHomework] = useState(null);
  const [homeworkDetails, setHomeworkDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // These states would be connected to functionality later
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    // First fetch basic homework info
    fetch(`${API.baseUrl}/getHomeworkDetails/${homeworkId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Homework details not found');
        }
        return response.json();
      })
      .then(detailsData => {
        setHomeworkDetails(detailsData);
        setCode(detailsData.starterCode || "// Your code here");
        
        // Then fetch homework metadata
        return fetch(`${API.baseUrl}/getHomework`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Homework not found');
        }
        return response.json();
      })
      .then(homeworkData => {
        const currentHomework = homeworkData.find(hw => hw.id === homeworkId);
        if (currentHomework) {
          setHomework(currentHomework);
        } else {
          throw new Error('Homework not found');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading homework:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [homeworkId]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setIsModified(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleRunCode = () => {
    // Show loading state in terminal
    setOutput("Running code...");
    
    // Create a payload with the code and assignment information
    const payload = {
      code: code,
      homeworkId: homeworkId,
      language: homeworkDetails.content.find(item => item.type === 'code')?.language || 'python'
    };
    
    // Send the code to the server for execution
    fetch(`${API.baseUrl}/runCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to run code');
      }
      return response.json();
    })
    .then(data => {
      // Handle the new response format with result and time
      if (data.result !== undefined) {
        const executionTime = data.time ? `\n\nExecution time: ${data.time}ms` : '';
        let result = data.result || 'Code executed with no output.'; 
        setOutput(result + executionTime);
      } else {
        setOutput("Code executed successfully with no output.");
      }
    })
    .catch(err => {
      console.error("Error running code:", err);
      setOutput(`Error: ${err.message}\n\nMake sure your code is correctly formatted.`);
    });
  };

  const handleClearOutput = () => {
    setOutput("");
  };

  const handleSubmitCode = () => {
    // Show submission status in the output terminal
    setOutput("Submitting your solution...");
    
    // Create a payload with the code and assignment information
    const payload = {
      userId: activeUser.id, // Include the user ID from context
      code: code,
      homeworkId: homeworkId,
      submissionDate: new Date().toISOString()
    };
    
    // Send the code to the server for submission
    fetch(`${API.baseUrl}/submitHomework`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit homework');
      }
      return response.json();
    })
    .then(data => {
      // Display success message and any feedback
      setOutput(data.message || "Homework submitted successfully!");
    })
    .catch(err => {
      console.error("Error submitting homework:", err);
      setOutput(`Error: ${err.message}\n\nFailed to submit your homework. Please try again.`);
    });
  };

  const renderContent = (content) => {
    if (!content) return null;
    
    return content.map((item, index) => {
      switch (item.type) {
        case 'text':
          return <p key={index} className="content-text">{item.content}</p>;
          
        case 'heading':
          return <h3 key={index} className="content-heading">{item.content}</h3>;
          
        case 'list':
          return (
            <ul key={index} className="content-list">
              {item.items.map((listItem, listIndex) => (
                <li key={listIndex}>{listItem}</li>
              ))}
            </ul>
          );
          
        case 'code':
          return (
            <div key={index} className="content-code">
              <div className="code-language">{item.language}</div>
              <pre><code>{item.content}</code></pre>
            </div>
          );
          
        default:
          return <div key={index}>Unsupported content type: {item.type}</div>;
      }
    });
  };

  if (loading) return <div className="hw-loading">Loading assignment...</div>;
  if (error) return <div className="hw-error">Error: {error}</div>;
  if (!homework || !homeworkDetails) return <div className="hw-not-found">Assignment not found</div>;

  return (
    <div className="homework-detail-container">
      <header className="homework-detail-header">
        <h1>{homeworkDetails.title}</h1>
        <div className="homework-meta">
          <span className="due-date">Due: {new Date(homework.dueDate).toLocaleDateString()}</span>
          <span className={`status ${homework.status}`}>{homework.status}</span>
          {isModified && <span className="modified-indicator">Modified</span>}
        </div>
      </header>
      
      <main className="homework-detail-layout">
        {/* Top section with side-by-side layout */}
        <div className="top-content">
          <section className="assignment-description">
            <div className="description-header">
              <h2>Assignment</h2>
            </div>
            <div className="description-content">
              <p className="description-summary">{homeworkDetails.description}</p>
              {renderContent(homeworkDetails.content)}
            </div>
          </section>
          
          <section className="code-editor">
            <div className="editor-header">
              <h2>Code Editor</h2>
              <div className="editor-actions">
                <button className="run-btn" onClick={handleRunCode}>Run Code</button>
                <button className="submit-btn" onClick={handleSubmitCode}>Submit</button>
              </div>
            </div>
            <div className="editor-area">
              <textarea 
                className="code-textarea"
                value={code}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                placeholder="Write your code here..."
                spellCheck="false"
              />
            </div>
          </section>
        </div>
        
        {/* Bottom section with full-width terminal */}
        <div className="terminal-container">
          <div className="terminal-header">
            <h3>Output</h3>
            <button className="clear-btn" onClick={handleClearOutput}>Clear</button>
          </div>
          <div className="terminal-output">
            <pre>{output || "// Code output will appear here when you run your code"}</pre>
          </div>
        </div>
      </main>
      
      <div className="homework-actions">
        <Link to="/homework" className="back-btn">Back to Assignments</Link>
      </div>
    </div>
  );
};

export default HomeworkDetail;