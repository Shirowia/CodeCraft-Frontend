import React, { useEffect, useState, useMemo } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Home from './components/Homepage';
import Menu from './components/Menu';
import ForgotPassword from './components/forgot-password';
import Settings from './components/Settings';
import Learn from './components/Learn';
import SkillTree from './components/Skilltree';
import DailyChallenge from './components/DailyChallenge';
import Communities from './components/Communities';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './styles/general.css';
import './styles/skilltree.css';
import { DailyChallengeProvider } from './DailyChallengeContext'; // Import the provider
import Tutorial from './components/Tutorial';

// Private Route Component
const PrivateRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use useMemo to prevent unnecessary re-renders
  const auth = useMemo(() => getAuth(), []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <div className="flex-container flex-center vh-100">

        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <DailyChallengeProvider>
      <Router>
        <div className="flex-container vh-100">
          {/* Main Content */}
          <div className="flex-grow p-4 overflow-auto">

            <Routes>
              <Route path="/menu" element={<PrivateRoute user={user}><Menu /></PrivateRoute>} />
              <Route path="/daily-challenge" element={<PrivateRoute user={user}><DailyChallenge /></PrivateRoute>} />
              <Route path="/learn" element={<PrivateRoute user={user}><Learn /></PrivateRoute>} />
              <Route path="/tutorial/:tutorialId" element={<PrivateRoute user={user}><Tutorial /></PrivateRoute>} />
              <Route path="/communities" element={<PrivateRoute user={user}><Communities /></PrivateRoute>} />
              <Route path="/skilltree" element={<PrivateRoute user={user}><SkillTree /></PrivateRoute>} />
              <Route path="/homepage" element={<Home />} />
              <Route path="/profile" element={<PrivateRoute user={user}><Profile /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute user={user}><Settings /></PrivateRoute>} />
              <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/menu" />} />
              <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/menu" />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/menu" />} />
              <Route path="/" element={<Navigate to="/homepage" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </DailyChallengeProvider>
  );
};

export default App;
