import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
const API_URL = process.env.REACT_APP_API_URL;

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Validation regex patterns
  const nameRegex = /^[a-zA-Z0-9]{3,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = async e => {
    e.preventDefault();
    // Client-side validations
    if (!nameRegex.test(name)) {
      $('#registerAlert').text('Username must be 3-20 alphanumeric characters').removeClass('d-none').fadeIn().delay(3000).fadeOut();
      return;
    }
    if (!emailRegex.test(email)) {
      $('#registerAlert').text('Please enter a valid email address').removeClass('d-none').fadeIn().delay(3000).fadeOut();
      return;
    }
    if (!passwordRegex.test(password)) {
      $('#registerAlert').text('Password must be at least 8 characters and include letters and numbers').removeClass('d-none').fadeIn().delay(3000).fadeOut();
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem('token', token);
        navigate('/');
      } else {
        const { message } = await res.json();
        $('#registerAlert').text(message).removeClass('d-none').fadeIn().delay(3000).fadeOut();
      }
    } catch (err) {
      $('#registerAlert').text('Server error').removeClass('d-none').fadeIn().delay(3000).fadeOut();
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-4">Register</h2>
        <div className="alert alert-danger d-none" id="registerAlert"></div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input type="text" className="form-control" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;