import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import { getAuth } from 'firebase/auth';
import '../styles/general.css';


const App = () => {
  const PrivateRoute = ({ children }) => {
    const auth = getAuth();
    return auth.currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      {/* Main container for the entire app */}
      <div className="container mt-4">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light rounded shadow-sm">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">CodeCraft</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
                <h1>Gay</h1>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="mt-4 p-4 bg-white rounded shadow-sm">
          <Routes>
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
