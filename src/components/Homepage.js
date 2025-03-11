import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/general.css';

const Homepage = () => {
  return (
    <div className="homepage-container">
      <img src={logo} alt="Logo" className="homepage-logo" />
      <div className="homepage-buttons">
        <Link to="/login">
          <button className="homepage-button">Login</button>
        </Link>
        <Link to="/signup">
          <button className="homepage-button">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
