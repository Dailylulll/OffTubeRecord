import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsAuth(!!localStorage.getItem('token'));
    // fetch current user info when authenticated
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUserName(data.name))
        .catch(() => setUserName(''));
    } else {
      setUserName('');
    }
  }, [location, isAuth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">OffTubeRecord</Link>
        <form className="d-flex" onSubmit={handleSubmit}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
        <div className="d-flex ms-auto align-items-center">
          {isAuth ? (
            <>
              <span className="navbar-text me-2">Signed in as {userName}</span>
              <div className="nav-item dropdown ms-2">
                <a className="nav-link dropdown-toggle" href="#" id="historyDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  History
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="historyDropdown">
                  <li><Link className="dropdown-item" to="/history/videos">Videos</Link></li>
                  <li><Link className="dropdown-item" to="/history/comments">Comments</Link></li>
                </ul>
              </div>
              <button className="btn btn-link nav-link ms-2" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link me-2" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;