import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/general.css'; // Ensure styles are managed in CSS

const HomePage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 dark-mode">
      <img 
        src={logo} 
        alt="CodeCraft Logo" 
        className="img-fluid mb-4 homepage-logo" 
      />
      <div className="d-flex gap-3 flex-wrap">
        <Link to="/login" className="btn btn-outline-light btn-lg" aria-label="Go to Login">
          Login
        </Link>
        <Link to="/signup" className="btn btn-primary btn-lg" aria-label="Go to Sign Up">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
