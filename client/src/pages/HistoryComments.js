import React, { useState, useEffect } from 'react';
import Comment from '../components/Comment';

const API_URL = process.env.REACT_APP_API_URL;

const HistoryComments = () => {
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API_URL}/history/comments`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));
  }, [token]);

  // fetch current user ID to check ownership
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setUserId(data.id))
        .catch(err => console.error(err));
    }
  }, [token]);

  // handlers for editing and deleting comments
  const updateComment = async (id, content) => {
    try {
      const res = await fetch(`${API_URL}/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        const updated = await res.json();
        setComments(comments.map(c => c._id === id ? { ...updated, title: c.title } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (id) => {
    try {
      const res = await fetch(`${API_URL}/comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setComments(comments.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Comment History</h1>
      {comments.length === 0 ? (
        <p>You haven't posted any comments yet.</p>
      ) : (
        <div className="list-group">
          {comments.map(c => (
            <Comment
              key={c._id}
              comment={c}
              onUpdate={updateComment}
              onDelete={deleteComment}
              showLink={true}
              isAuthor={userId === c.author._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryComments;