import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/general.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setError('');
      navigate('/menu'); // Redirect to menu page after login
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="shadow-lg p-5 rounded w-75">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            <p className="text-center mt-3">
              Don't have an account?{' '}
              <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/signup')}>
                Sign Up
              </span>
              </p>
              <p className="text-center mt-3">
              {' '}
              <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/forgot-password')}>
                Forgot Password?
              </span>
            </p>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img src={logo} alt="Logo" className="img-fluid w-75" />
        </div>
      </div>
    </div>
  );
};

export default Login;
