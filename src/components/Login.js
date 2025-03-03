import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/general.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/menu');
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Function to convert Firebase error codes into user-friendly messages
  const getErrorMessage = (code) => {
    const errorMessages = {
      'auth/invalid-email': 'Invalid email format.',
      'auth/user-not-found': 'No user found with this email.',
      'auth/wrong-password': 'Incorrect password. Try again.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many login attempts. Try again later.',
    };
    return errorMessages[code] || 'Failed to login. Please try again.';
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        {/* Login Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="shadow-lg p-5 rounded w-75 dark-mode">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Enter your email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Enter your password"
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="text-center mt-3">
              <Link to="/forgot-password" className="text-primary">Forgot Password?</Link>
            </div>
            <div className="text-center mt-2">
              Don't have an account? <Link to="/signup" className="text-primary">Sign Up</Link>
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="col-md-6 d-flex align-items-center justify-content-center border-start border-2">
          <img src={logo} alt="CodeCraft Logo" className="img-fluid w-75" />
        </div>
      </div>
    </div>
  );
};

export default Login;
