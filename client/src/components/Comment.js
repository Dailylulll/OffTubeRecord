import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Comment = ({ comment, onUpdate, onDelete, showLink, isAuthor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const handleSave = () => {
    onUpdate(comment._id, content);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="list-group-item">
      <div className="d-flex justify-content-between">
        <strong>{comment.author.name}</strong>
        <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
      </div>
      {showLink && comment.title && (
        <div>
          <Link to={`/videos/${comment.videoId}`}>{comment.title}</Link>
        </div>
      )}
      {isEditing ? (
        <>
          <textarea
            className="form-control my-2"
            rows="3"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button className="btn btn-sm btn-primary me-2" onClick={handleSave}>Save</button>
          <button className="btn btn-sm btn-secondary" onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <p className="mt-2 mb-2">{comment.content}</p>
      )}
      {!isEditing && isAuthor && (
        <>
          <button className="btn btn-sm btn-link text-decoration-none me-2" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="btn btn-sm btn-link text-danger" onClick={() => onDelete(comment._id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default Comment;