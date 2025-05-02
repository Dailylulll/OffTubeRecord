import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
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