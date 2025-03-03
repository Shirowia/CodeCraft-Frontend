import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import logo from '../assets/logo.png';
import '../styles/general.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName });

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName,
        createdAt: new Date(),
      });

      navigate('/menu');
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Firebase errors
  const getErrorMessage = (code) => {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already in use.',
      'auth/invalid-email': 'Invalid email format.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/operation-not-allowed': 'Sign-up is currently disabled.',
    };
    return errorMessages[code] || 'Failed to sign up. Please try again.';
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        {/* Signup Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="shadow-lg p-5 rounded w-75 dark-mode">
            <h2 className="text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="displayName">Full Name</label>
                <input
                  type="text"
                  id="displayName"
                  className="form-control"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  aria-label="Enter your full name"
                />
              </div>
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
              <div className="mb-3">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  aria-label="Confirm your password"
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
            <div className="text-center mt-3">
              Already have an account? <Link to="/login" className="text-primary">Login</Link>
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

export default Signup;
