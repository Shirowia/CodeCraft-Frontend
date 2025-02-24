import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/general.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset link sent! Check your email.');
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="shadow-lg p-5 rounded w-75">
            <h2 className="text-center mb-4">Forgot Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {message && <p className="text-success">{message}</p>}
              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary w-100">
                Send Reset Link
              </button>
            </form>
            <div className="text-center mt-3">
              <Link to="/login" className="text-muted">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img src={logo} alt="Logo" className="img-fluid w-75" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
