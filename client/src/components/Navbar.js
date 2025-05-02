import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsAuth(!!localStorage.getItem('token'));
  }, [location]);

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
        <div className="d-flex ms-auto">
          {isAuth ? (
            <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
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