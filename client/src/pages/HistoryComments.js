import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HistoryComments = () => {
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/history/comments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <div>
      <h1 className="mb-4">Comment History</h1>
      {comments.length === 0 ? (
        <p>You haven't posted any comments yet.</p>
      ) : (
        <ul className="list-group">
          {comments.map(c => (
            <li key={c._id} className="list-group-item">
              <p>{c.content}</p>
              <p className="text-muted">
                {new Date(c.createdAt).toLocaleString()} on{' '}
                <Link to={`/videos/${c.videoId}`}>{c.title}</Link>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryComments;