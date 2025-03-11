import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/general.css';

const Navigation = ({ handleLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex">
      <div className={`bg-dark text-white p-3 d-flex flex-column ${isSidebarOpen ? 'd-block' : 'd-none'}`} style={{ width: '250px' }}>
        <button className="btn btn-dark" onClick={toggleSidebar} style={{ width: '40px', alignSelf: 'flex-start' }}>
          &#9776;
        </button>
        <div className="text-center mb-4">
          <img src ={logo} alt="Logo" height="50" style={{padding: '3px'}} />
        </div>
        <ul className="nav flex-column flex-grow-1">
          <li className="nav-item"><Link className="nav-link text-white" to="/menu">Menu</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/profile">Profile</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/daily-challenge">Daily Challenges</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/skilltree">Skill Tree</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/learn">Learn</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/communities">Communities</Link></li>
        </ul>
        <ul className="nav flex-column">
          <li className="nav-item mt-auto"><Link to="/settings"><button className="btn btn-outline-light game-menu-button w-100">Settings</button></Link></li>
          <li className="nav-item"><button className="btn btn-danger w-100 mt-3 game-menu-button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
      <div className="flex-grow-1 p-4">
        {!isSidebarOpen && (
          <button className="bg-dark btn btn-primary-no-outline mb-3" onClick={toggleSidebar} style={{ width: '40px' }}>
          &#9776;
        </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;
