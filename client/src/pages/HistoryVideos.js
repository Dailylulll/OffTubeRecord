import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HistoryVideos = () => {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/history/videos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <div>
      <h1 className="mb-4">Video History</h1>
      <div className="row">
        {history.length === 0 && <p>You haven't watched any videos yet.</p>}
        {history.map(entry => (
          <div key={entry._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src={entry.thumbnail} className="card-img-top" alt={entry.title} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{entry.title}</h5>
                <p className="text-muted">{new Date(entry.createdAt).toLocaleString()}</p>
                <Link to={`/videos/${entry.videoId}`} className="mt-auto btn btn-primary">Watch Again</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryVideos;