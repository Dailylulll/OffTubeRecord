import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const queryParam = useQuery().get('q') || '';
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (queryParam) {
      axios.get(`${API_URL}/youtube/search?q=${encodeURIComponent(queryParam)}`)
        .then(res => setVideos(res.data))
        .catch(err => console.error(err));
    }
  }, [queryParam]);

  return (
    <div>
      <h1 className="mb-4">Search Results for "{queryParam}"</h1>
      <div className="row">
        {videos.map(video => (
          <div key={video.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src={video.thumbnail} className="card-img-top" alt={video.title} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{video.title}</h5>
                <Link to={`/videos/${video.id}`} className="mt-auto btn btn-primary">Watch & Comment</Link>
              </div>
            </div>
          </div>
        ))}
        {videos.length === 0 && queryParam && <p>No results found.</p>}
      </div>
    </div>
  );
};

export default SearchResults;
