import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import '../styles/general.css';
import { DailyChallengeContext } from '../DailyChallengeContext';

const Menu = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { challenge, loading } = useContext(DailyChallengeContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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
        <h2>Welcome, {user ? user.displayName || 'User' : 'Guest'}!</h2>
        <hr />
        <div className="row">
          <div className="col-md-4">
            <div className="text-white card p-3 shadow-sm">
              <h5>Daily Challenges</h5>
              {loading ? (
                <p>Loading challenge...</p>
              ) : !challenge ? (
                <p>No challenge available today.</p>
              ) : (
                <>
                  <p><strong>{challenge.name}</strong></p>
                  <p>{challenge.description}</p>
                  <p><small>{challenge.createdAt.toDate().toISOString().split('T')[0]}</small></p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
