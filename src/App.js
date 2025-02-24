import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Menu from './components/Menu';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './styles/general.css';
import Settings from './components/Settings';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <div>Loading...</div>; // Prevents flicker while checking auth
  }

  return (
    <Router>
      <div className="container mt-4">
        {/* Page Content */}
        <div className="mt-4 p-4 bg-white rounded shadow-sm">
          <Routes>
            <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/signup" element={user ? <Navigate to="/menu" /> : <Signup />} />
            <Route path="/login" element={user ? <Navigate to="/menu" /> : <Login />} />
            <Route path="/" element={<Navigate to={user ? "/menu" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
