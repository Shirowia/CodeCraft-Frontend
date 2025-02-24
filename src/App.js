  import React, { useEffect, useState } from 'react';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
  import Signup from './components/Signup';
  import Login from './components/Login';
  import Profile from './components/Profile';
  import Home from './components/Homepage';
  import Menu from './components/Menu';
  import ForgotPassword from './components/forgot-password';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import './styles/general.css';
  import Settings from './components/Settings';

  const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });


      return () => unsubscribe();
    }, [auth]);

    const PrivateRoute = ({ children }) => {
      return user ? children : <Navigate to="/login" />;
    };    

    if (loading) {
      return <div>Loading...</div>; 
    }

    return (
      <Router>
        <div className="container mt-4">
          {/* Pages; */}
          <div className="mt-4 p-4 bg-white rounded shadow-sm">
          <Routes>
            <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
            <Route path="/homepage" element={<Home />} /> {/* Public Route */}
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/forgot-password" element={user ? <Navigate to="/forgot-password" /> : <ForgotPassword />} />
            <Route path="/signup" element={user ? <Navigate to="/menu" /> : <Signup />} />
            <Route path="/login" element={user ? <Navigate to="/menu" /> : <Login />} />
            <Route path="/" element={<Navigate to="/homepage" />} />
          </Routes>
          </div>
        </div>
      </Router>
    );
  };

  export default App;
