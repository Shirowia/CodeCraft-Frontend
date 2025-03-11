import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/general.css';

const Menu = () => {
  const [user, setUser] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const navigate = useNavigate();

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

  const fetchChallenges = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'challenges'));
      const challenges = querySnapshot.docs.map(doc => doc.data());

      if (challenges.length > 0) {
        const randomIndex = Math.floor(Math.random() * challenges.length);
        const selectedChallenge = challenges[randomIndex];
        setChallenge(selectedChallenge);
      } else {
        console.log('No challenges found.');
        setChallenge(null);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

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
      <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" height="50" />
          <h4 className="mt-2">CodeCraft</h4>
        </div>
        <ul className="nav flex-column flex-grow-1">
          <li className="nav-item"><Link className="nav-link text-white" to="/menu">Menu</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/profile">Profile</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/daily-challenge">Daily Challenges</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/skilltree">Skill Tree</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/learn">Learn</Link></li>
          <li className="nav-item"><Link className="nav-link text-white active" to="/communities">Communities</Link></li>
        </ul>

        <ul className="nav flex-column">
          <li className="nav-item mt-auto"><Link to="/settings"><button className="btn btn-outline-light game-menu-button w-100">⚙️ Settings</button></Link></li>
          <li className="nav-item"><button className="btn btn-danger w-100 mt-3 game-menu-button" onClick={handleLogout}>🚪 Logout</button></li>
        </ul>
      </div>

      <div className="flex-grow-1 p-4">
        <h2>Welcome, {user ? user.displayName || 'User' : 'Guest'}!</h2>
        <hr />
        <div className="row">
          <div className="col-md-4">
            <div className="text-white card p-3 shadow-sm">
              <h5>Daily Challenges</h5>
              {challenge ? (
                <>
                  <p><strong>{challenge.name}</strong></p>
                  <p>{challenge.description}</p>
                  <p><small>{challenge.createdAt.toDate().toISOString().split('T')[0]}</small></p>
                </>
              ) : (
                <p>No challenge available today.</p>
              )}
            </div>
          </div>
            </div>
          </div>
        </div>
  );
};

export default Menu;
