import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getAuth, signOut } from 'firebase/auth';

const Menu = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const displayName = user?.displayName || 'User';

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="d-flex flex-column p-3 bg-dark text-white" style={{ width: '250px' }}>
        <h2 className="text-center mb-4">CodeCraft</h2>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/lessons" className="nav-link text-white">Lessons</Link>
          </li>
          <li>
            <Link to="/challenges" className="nav-link text-white">Challenges</Link>
          </li>
          <li>
            <Link to="/profile" className="nav-link text-white">Profile</Link>
          </li>
          <li>
            <Link to="/settings" className="nav-link text-white">Settings</Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="btn btn-danger w-100 mt-3">Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-5 bg-light">
        <h1>Hello, {displayName}</h1>
        <p>Welcome to CodeCraft! Continue your journey by selecting a section from the sidebar.</p>
        <div className="d-flex gap-3 mt-4">
          <Link to="/lessons">
            <Button variant="primary">Start Lessons</Button>
          </Link>
          <Link to="/challenges">
            <Button variant="success">Take Challenges</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;
