// import React from 'react'
import "./Forum.css";

function Forum() {
  const threads = [
    {
      id: 1,
      title: "How do I implement a binary search algorithm?",
      content: "I'm struggling to understand how binary search works. Can someone explain it to me?",
      reply: "Sure! Binary search works by dividing the array in half and checking if the middle element is the target. If not, it decides which half to search next based on whether the target is greater or less than the middle element.",
      user: "shimmeringGazelle24",
      timestamp: "01/03/2025 10:51",
      replyUser: "Teacher B",
      replyTimestamp: "02/03/2025 11:09",
      isTeacherReply: true,
      studentReplies: [
        {
          reply: "I found a great video on YouTube that explains it step by step!",
          replyUser: "Anonymous",
          replyTimestamp: "01/03/2025 11:30"
        },
        {
          reply: "Binary search is really efficient for large datasets!",
          replyUser: "jane.doe",
          replyTimestamp: "01/03/2025 12:00"
        },
        {
          reply: "Make sure your array is sorted before using binary search.",
          replyUser: "braveLion42",
          replyTimestamp: "01/03/2025 12:15"
        }
      ]
    },
    {
      id: 2,
      title: "What is the difference between let and var in JavaScript?",
      content: "I often see both let and var used in JavaScript code. What's the difference?",
      reply: "The main difference is scope. 'var' is function-scoped, while 'let' is block-scoped. This means 'let' is more predictable and safer to use in modern JavaScript.",
      user: "Anonymous",
      timestamp: "17/02/2025 09:37",
      replyUser: "Teacher C",
      replyTimestamp: "17/02/2025 10:15",
      isTeacherReply: true,
      studentReplies: [
        {
          reply: "I think 'let' is better for most cases because it avoids some common bugs.",
          replyUser: "Anonymous",
          replyTimestamp: "17/02/2025 10:00"
        },
        {
          reply: "'var' can lead to unexpected behavior due to hoisting.",
          replyUser: "john.smith",
          replyTimestamp: "17/02/2025 10:30"
        },
        {
          reply: "I always use 'let' and 'const' in my projects now.",
          replyUser: "curiousCat99",
          replyTimestamp: "17/02/2025 10:45"
        }
      ]
    },
    {
      id: 3,
      title: "How can I center a div in CSS?",
      content: "I'm trying to center a div both vertically and horizontally. What's the best way to do this?",
      reply: "You can use flexbox to center a div easily. Set the parent container to 'display: flex', and use 'justify-content: center' and 'align-items: center'.",
      user: "farhan.adey",
      timestamp: "03/10/2024 14:18",
      replyUser: "Teacher D",
      replyTimestamp: "03/10/2024 17:40",
      isTeacherReply: true
    }
  ];

  return (
    <div className="forum-page">
      <div className="forum-header">
        <h1 className="forum-title">Student Forum</h1>
        <p className="forum-subtitle">Discuss and find answers to your questions</p>
      </div>

      {threads.map((thread) => (
        <div key={thread.id} className="thread">
          <div className="thread-meta">{thread.user} - {thread.timestamp}</div>
          <h2 className="thread-title">{thread.title}</h2>
          <p className="thread-content">{thread.content}</p>
          <div className={`thread-reply ${thread.isTeacherReply ? 'teacher-reply' : ''}`}>
            {thread.reply}
            <div className="thread-reply-meta">{thread.replyUser} - {thread.replyTimestamp}</div>
          </div>
          {thread.studentReplies && thread.studentReplies.map((studentReply, index) => (
            <div key={index} className="thread-reply">
              {studentReply.reply}
              <div className="thread-reply-meta">{studentReply.replyUser} - {studentReply.replyTimestamp}</div>
            </div>
          ))}
        </div>
      ))}

      <div className="new-query">
        <input
          type="text"
          className="query-input"
          placeholder="Enter your question here..."
        />
      </div>
    </div>
  );
}

export default Forum;