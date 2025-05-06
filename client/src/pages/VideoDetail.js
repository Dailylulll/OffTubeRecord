import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import $ from 'jquery';

const VideoDetail = () => {
  const { videoId } = useParams();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const token = localStorage.getItem('token');

  // record video view in history
  React.useEffect(() => {
    if (token) {
      fetch('/api/history/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ videoId })
      }).catch(err => console.error(err));
    }
  }, [videoId, token]);

  useEffect(() => {
    fetch(`/api/comments/${videoId}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));
  }, [videoId]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/comments', {
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
      <ul className="list-group">
        {comments.map(c => (
          <li key={c._id} className="list-group-item">
            <strong>{c.author.name}</strong> <small className="text-muted float-end">{new Date(c.createdAt).toLocaleString()}</small>
            <p className="mt-2 mb-0">{c.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoDetail;