import React, { useContext, useState } from 'react';
import { auth } from '../firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import logo from '../assets/logo.png';
import '../styles/general.css';
import { DailyChallengeContext } from '../DailyChallengeContext'; // Import the context

const DailyChallenge = () => {
  const { challenge, loading, fetchChallenges } = useContext(DailyChallengeContext); // Use the context
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex vh-100">
      <div className={`bg-dark text-white p-3 d-flex flex-column ${isSidebarOpen ? 'd-block' : 'd-none'}`} style={{ width: '250px' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" height="50" />
          <h4 className="mt-2">CodeCraft</h4>
        </div>
        <ul className="nav flex-column flex-grow-1">
          <li className="nav-item"><Link className="nav-link text-white" to="/menu">Menu</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/profile"> Profile</Link></li>
          <li className="nav-item"><Link className="nav-link text-white active" to="/daily-challenge"> Daily Challenges</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/skilltree"> Skill Tree</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/learn"> Learn</Link></li>
          <li className="nav-item"><Link className="nav-link text-white active" to="/communities">Communities</Link></li>
        </ul>

        <ul className="nav flex-column">
          <li className="nav-item mt-auto"><Link to="/settings"><button className="btn btn-outline-light game-menu-button w-100">Settings</button></Link></li>
          <li className="nav-item"><button className="btn btn-danger w-100 mt-3 game-menu-button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>

      <div className="flex-grow-1 p-4">
        <button className="btn btn-primary mb-3" onClick={toggleSidebar}>
          {isSidebarOpen ? 'Hide Menu' : 'Show Menu'}
        </button>
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
