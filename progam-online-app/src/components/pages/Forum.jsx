import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext"; // Import the user context
import "./Forum.css";

function Forum() {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the active user from context
  const { activeUser } = useUser();
  
  // Form states
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingToId, setReplyingToId] = useState(null);
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);

  // Use a display name for the UI that can be customized
  const [displayName, setDisplayName] = useState(activeUser.name);

  useEffect(() => {
    const fetchForumThreads = async () => {
      try {
        const response = await fetch('http://localhost:5000/getForumThreads');
        if (!response.ok) {
          throw new Error('Failed to fetch forum threads');
        }
        const data = await response.json();
        
        // Sort threads by timestamp, newest first
        const sortedThreads = sortThreadsByDate(data);
        setThreads(sortedThreads);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForumThreads();
  }, []);

  // Helper function to convert DD/MM/YYYY HH:MM to Date object
  const parseTimestamp = (timestamp) => {
    if (!timestamp) return new Date(0); // Handle missing timestamps
    
    const [datePart, timePart] = timestamp.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute] = timePart ? timePart.split(':') : [0, 0];
    
    return new Date(year, month - 1, day, hour, minute);
  };

  // Sort threads by timestamp (newest first)
  const sortThreadsByDate = (threadsArray) => {
    return [...threadsArray].sort((a, b) => {
      const dateA = parseTimestamp(a.timestamp);
      const dateB = parseTimestamp(b.timestamp);
      return dateB - dateA; // For descending order (newest first)
    });
  };

  const handleNewThreadSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/postForumThread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newThreadTitle,
          content: newThreadContent,
          user: displayName,
          userId: activeUser.id // Include the user ID from context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post new thread');
      }

      const newThread = await response.json();
      
      // Add the new thread and re-sort
      const updatedThreads = sortThreadsByDate([...threads, newThread]);
      setThreads(updatedThreads);
      
      // Reset form
      setNewThreadTitle("");
      setNewThreadContent("");
      setShowNewThreadForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!replyingToId || !replyContent.trim()) return;
    
    try {
      const response = await fetch('http://localhost:5000/postForumReply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId: replyingToId,
          reply: replyContent,
          user: displayName,
          userId: activeUser.id // Include the user ID from context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post reply');
      }

      const newReply = await response.json();
      
      // Update threads state with the new reply
      const updatedThreads = threads.map(thread => {
        if (thread.id === replyingToId) {
          return {
            ...thread,
            replies: [...thread.replies, newReply],
          };
        }
        return thread;
      });
      
      setThreads(sortThreadsByDate(updatedThreads));
      
      // Reset reply form
      setReplyContent("");
      setReplyingToId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="forum-page">Loading forum threads...</div>;
  }

  if (error) {
    return <div className="forum-page">Error: {error}</div>;
  }

  return (
    <div className="forum-page">
      <div className="forum-header">
        <h1 className="forum-title">Student Forum</h1>
        <p className="forum-subtitle">Discuss and find answers to your questions</p>
        
        <div className="user-controls">
          <label htmlFor="username">Posting as: </label>
          <input
            type="text"
            id="username"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={"User " + activeUser.id}
            className="username-input"
          />
          <button 
            className="new-thread-button"
            onClick={() => setShowNewThreadForm(!showNewThreadForm)}
          >
            {showNewThreadForm ? 'Cancel' : 'Create New Thread'}
          </button>
        </div>
        
        {showNewThreadForm && (
          <form className="new-thread-form" onSubmit={handleNewThreadSubmit}>
            <input
              type="text"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              placeholder="Thread title"
              required
              className="thread-title-input"
            />
            <textarea
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
              placeholder="Your question or topic"
              required
              className="thread-content-input"
            />
            <button type="submit" className="submit-thread-button">Post Thread</button>
          </form>
        )}
      </div>

      {threads.map((thread) => (
        <div key={thread.id} className="thread">
          <div className="thread-meta">{thread.user} - {thread.timestamp}</div>
          <h2 className="thread-title">{thread.title}</h2>
          <p className="thread-content">{thread.content}</p>
          
          {thread.replies.map((reply, index) => (
            <div key={index} className={`thread-reply ${reply.isTeacherReply ? 'teacher-reply' : ''}`}>
              {reply.reply}
              <div className="thread-reply-meta">{reply.replyUser} - {reply.replyTimestamp}</div>
            </div>
          ))}
          
          {replyingToId === thread.id ? (
            <form className="reply-form" onSubmit={handleReplySubmit}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Your reply"
                required
                className="reply-input"
              />
              <div className="reply-buttons">
                <button type="submit" className="submit-reply-button">Post Reply</button>
                <button 
                  type="button" 
                  className="cancel-reply-button"
                  onClick={() => setReplyingToId(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button 
              className="reply-button"
              onClick={() => setReplyingToId(thread.id)}
            >
              Reply to this thread
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Forum;