import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/general.css';
import {  query, where } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const Menu = () => {
  const [user, setUser] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const timestampToday = Timestamp.fromDate(today);
  
        const q = query(collection(db, 'challenges'), where('createdAt', '>=', timestampToday));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const challengeData = querySnapshot.docs[0].data();
          setChallenge(challengeData);
        } else {
          console.log('No challenge found for today.');
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
      }
    };
  
    fetchChallenge();
  }, []);
  
  

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      const querySnapshot = await getDocs(collection(db, 'trendingTopics'));
      setTrendingTopics(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchTrendingTopics();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const querySnapshot = await getDocs(collection(db, 'leaderboard'));
      setLeaderboard(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchLeaderboard();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <div className="d-flex vh-100">
      <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" height="50" />
          <h4 className="mt-2">CodeCraft</h4>
        </div>
        <ul className="nav flex-column flex-grow-1">
          <li className="nav-item"><Link className="nav-link text-white" to="/profile">👤 Profile</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/daily-challenge">📅 Daily Challenges</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/skill-tree">🌳 Skill Tree</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/learn">🌳 Learn</Link></li>
        </ul>

        <ul className="nav flex-column">
          <li className="nav-item mt-auto"><Link to="/settings"><button className="btn btn-outline-light game-menu-button w-100">⚙️ Settings</button></Link></li>
          <li className="nav-item"><button className="btn btn-danger w-100 mt-3 game-menu-button" onClick={handleLogout}>🚪 Logout</button></li>
        </ul>
      </div>

      <div className="flex-grow-1 p-4">
        <h2>Welcome, {user ? user.displayName || 'User' : 'Guest'}!</h2>
        <hr />
        <div className="row">
                <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>📅 Daily Challenges</h5>
              {challenge ? (
                <>
                  <p><strong>{challenge.name}</strong></p>
                  <p>{challenge.description}</p>
                  <p><small>📅 {challenge.createdAt.toDate().toISOString().split('T')[0]}</small></p>
                </>
              ) : (
                <p>No challenge available today.</p>
              )}
            </div>
          </div>



          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>🔥 Trending Topics</h5>
              {trendingTopics.length > 0 ? trendingTopics.map((topic, index) => (
                <p key={index}>{topic.name}</p>
              )) : <p>No trending topics</p>}
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>🏆 Leaderboard</h5>
              {leaderboard.length > 0 ? leaderboard.map((user, index) => (
                <p key={index}>{user.name}: {user.score} pts</p>
              )) : <p>No leaderboard data</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
