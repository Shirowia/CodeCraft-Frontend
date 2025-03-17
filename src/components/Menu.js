import React, { useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Navigation from './Navigation';
import '../styles/general.css';
import '../styles/menu.css';
import { DailyChallengeContext } from '../DailyChallengeContext';
import ProgressTracker from './ProgressTracker';
import CourseProgressTracker from './CourseProgressTracker';

const Menu = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { challenge, loading: challengeLoading } = useContext(DailyChallengeContext);
  const [courseProgress, setCourseProgress] = useState({});
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      try {
        const progressRef = doc(db, 'courseProgress', currentUser.uid);
        const progressSnap = await getDoc(progressRef);
        if (progressSnap.exists()) {
          setCourseProgress(progressSnap.data().courses || {});
        }
      } catch (error) {
        console.error('Error fetching course progress:', error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const calculateCourseProgress = () => {
    if (!courseProgress || Object.keys(courseProgress).length === 0) {
      return 0;
    }
    const totalProgress = Object.values(courseProgress).reduce(
      (sum, course) => sum + (course.progressPercentage || 0),
      0
    );
    return Math.round(totalProgress / Object.keys(courseProgress).length);
  };

  const overallCourseProgress = calculateCourseProgress();

  useEffect(() => {
    document.body.classList.add('menu-body');
    return () => {
      document.body.classList.remove('menu-body');
    };
  }, []);

  return (
    <div className="d-flex with-nav">
      <Navigation handleLogout={handleLogout} />
      <div className="flex-grow-1 p-4 overflow-auto">
        <h2>Welcome, {user ? user.displayName || 'User' : 'Guest'}!</h2>

        {/* Main Layout: Two Columns */}
        <div className="menu-layout">
          {/* Column 1 - Learning Progress */}
          <div className="menu-column-main">
            <div className="card p-4 shadow-sm">
              <h3 className='mb-4' >Learning Progress</h3>
              <div className="d-flex flex-column">
                <div className="mb-4">
                  <h5 className="text-center mb-3">Skills</h5>
                  <div className="d-flex justify-content-center">
                    <ProgressTracker />
                  </div>
                </div>
                <div>
                  <h5 className="text-center mb-3">Courses</h5>
                  {loadingCourses ? (
                    <div className="d-flex justify-content-center">
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <CourseProgressTracker 
                        overallProgress={overallCourseProgress} 
                        courseProgress={courseProgress} 
                      />
                    </div>
                  )}
                </div>
                <div className="text-center mt-3">
                  <div className="flex-container gap-2 flex-center">
                    <button 
                      className="btn-primary"
                      onClick={() => navigate('/skilltree')}
                    >
                      View Skill Tree
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => navigate('/learn')}
                    >
                      View Courses
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 - Daily Challenge (Row 1) and Quick Access (Row 2) */}
          <div className="menu-column-secondary">
            {/* Row 1 - Daily Challenge */}
            <div className="card p-4 shadow-sm mb-4">
              <h3 className="mb-3">Daily Challenge</h3>
              {challengeLoading ? (
                <div className="flex-container flex-center">
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : !challenge ? (
                <div className="alert alert-secondary">No challenge available today.</div>
              ) : (
                <div>
                  <h5>{challenge.name}</h5>
                  <p className="mb-4">{challenge.description}</p>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/daily-challenge')}
                  >
                    Solve Challenge
                  </button>
                </div>
              )}
            </div>

            {/* Row 2 - Quick Access */}
            <div className="card p-4 shadow-sm">
              <h3 className="mb-3">Quick Access</h3>
              <div className="d-flex flex-column gap-2">
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/learn')}
                >
                  Learning Resources
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/communities')}
                >
                  Community
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/profile')}
                >
                  My Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End Main Layout */}
      </div>
    </div>
  );
};

export default Menu;