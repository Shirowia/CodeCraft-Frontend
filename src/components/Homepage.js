import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/HomePagelogo.png';
import '../styles/homepage.css';
import '../styles/general.css';

const Homepage = () => {
  useEffect(() => {
    document.body.classList.add('homepage-body');
    return () => {
      document.body.classList.remove('homepage-body');
    };
  }, []);

  return (
    <div className="homepage">
      <div className="homepage-container">
        <img src={logo} alt="Logo" className="homepage-logo" />
        <p>Redefining coding education by immersing you in a personalized, adaptive journey that transforms learning into an engaging experience.</p>
        <div className="homepage-buttons">
          <Link to="/login">
            <button className="homepage-button">LOGIN</button>
          </Link>
          <Link to="/signup">
            <button className="homepage-button">SIGN UP</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
