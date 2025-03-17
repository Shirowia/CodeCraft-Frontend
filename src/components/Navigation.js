import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/general.css';

const Navigation = ({ handleLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    if (!newState) {
      document.body.classList.add('nav-off');
    } else {
      document.body.classList.remove('nav-off');
    }
  };

  return (
    <>
      {/* Always visible toggle button */}
      <div className="toggle-container">
        <button className="toggle-btn" onClick={toggleSidebar}>
          &#9776;
        </button>
      </div>

      {/* Navigation content (will slide out when toggled off) */}
      <div className="navigation-wrapper">
        {isSidebarOpen && (
          <div className="navigation-container">
            <div className="text-center mb-4">
              <Link to="/menu">
                <img src={logo} alt="Logo" className="nav-logo" />
              </Link>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/daily-challenge">Daily Challenges</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/skilltree">Skill Tree</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/learn">Learn</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/communities">Communities</Link>
              </li>
            </ul>
            <ul className="nav flex-column">
              <li className="nav-item mt-auto">
                <Link to="/settings">
                  <button className="btn btn-outline-light game-menu-button w-100">Settings</button>
                </Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light game-menu-button w-100" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;