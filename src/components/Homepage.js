import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Adjust the path if necessary

const HomePage = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#1e1e2f' }}
    >
      <img
        src={logo}
        alt="CodeCraft Logo"
        className="img-fluid mb-4"
        style={{ height: '50vh' }}
      />
      <div className="d-flex gap-3">
        <Link to="/login" className="btn btn-outline-light">
          Login
        </Link>
        <Link to="/signup" className="btn btn-primary">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
