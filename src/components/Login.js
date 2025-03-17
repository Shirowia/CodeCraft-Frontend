import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/login.css';
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

  useEffect(() => {
    document.body.classList.add('login-body');
    return () => {
      document.body.classList.remove('login-body');
    };
  }, []);
  
  return (

    <div className="login">
    <div className="login-page-container">

      {/* Logo Section */}
      <div className="login-logo-container">
        <Link to="/homepage">
          <img src={logo} alt="CodeCraft Logo" className="login-logo" />
        </Link>
        </div>

      <div className="login-form-container">

        <div className="login-content">

            <h2 className="text-center mb-4">LOGIN</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email">EMAIL</label>
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
                <label htmlFor="password">PASSWORD</label>
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

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>

            </form>
            <div className="text-center mt-3">
              <Link to="/forgot-password" className="text-secondary">Forgot Password?</Link>
            </div>
            <div className="text-center mt-2">
              Don't have an account? <Link to="/signup" className="text-primary">SIGN UP</Link>
            </div>
          </div>
        </div>

      </div>

      </div>
  );
};

export default Login;
