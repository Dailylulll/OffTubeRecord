import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import $ from 'jquery';
import Comment from '../components/Comment';
const API_URL = process.env.REACT_APP_API_URL;

const VideoDetail = () => {
  const { videoId } = useParams();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem('token');

  // record video view in history
  React.useEffect(() => {
    if (token) {
      fetch(`${API_URL}/history/video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ videoId })
      }).catch(err => console.error(err));
    }
  }, [videoId, token]);

  // fetch current user ID to check ownership
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setUserId(data.id))
        .catch(err => console.error(err));
    }
  }, [token]);

  useEffect(() => {
    fetch(`${API_URL}/comments/${videoId}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));
  }, [videoId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content, videoId })
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setContent('');
        $('#commentSuccess').removeClass('d-none').text('Comment added!').fadeIn().delay(2000).fadeOut();
      } else {
        const { message } = await res.json();
        $('#commentAlert').removeClass('d-none').text(message).fadeIn().delay(3000).fadeOut();
      }
    } catch (err) {
      $('#commentAlert').removeClass('d-none').text('Server error').fadeIn().delay(3000).fadeOut();
    }
  };

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
        setComments(comments.map(c => c._id === id ? updated : c));
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
      <h2 className="mb-4">Video Detail</h2>
      <div className="ratio ratio-16x9 mb-4">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="video player"
          allowFullScreen
        ></iframe>
      </div>
      <div className="mb-4">
        {token ? (
          <form onSubmit={handleSubmit}>
            <div className="alert alert-danger d-none" id="commentAlert"></div>
            <div className="alert alert-success d-none" id="commentSuccess"></div>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Add a comment..."
                value={content}
                required
                onChange={e => setContent(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Post Comment</button>
          </form>
        ) : (
          <p>
            <Link to="/login">Log in</Link> to post comments.
          </p>
        )}
      </div>
      <h4 className="mb-3">Comments</h4>
      <div className="list-group">
        {comments.map(c => (
          <Comment
            key={c._id}
            comment={c}
            onUpdate={updateComment}
            onDelete={deleteComment}
            showLink={false}
            isAuthor={userId === c.author._id}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoDetail;