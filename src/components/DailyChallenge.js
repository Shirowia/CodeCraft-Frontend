import React, { useContext } from 'react';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import Navigation from './Navigation';
import '../styles/general.css';
import { DailyChallengeContext } from '../DailyChallengeContext';

const DailyChallenge = () => {
  const { challenge, loading, fetchChallenges } = useContext(DailyChallengeContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <div className="d-flex vh-100">
      <Navigation handleLogout={handleLogout} />
      <div className="flex-grow-1 p-4">
        <button className="btn btn-secondary mb-3" onClick={fetchChallenges}>
          Refresh Challenge
        </button>
        {loading ? (
          <p>Loading challenge...</p>
        ) : !challenge ? (
          <p>No challenge available today.</p>
        ) : (
          <div className="bg-dark text-white card p-3 shadow-sm">
            <h5>Daily Challenge</h5>
            <p><strong>{challenge.name}</strong></p>
            <p>{challenge.description}</p>
            <p><small>{new Date().toISOString().split('T')[0]}</small></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenge;
