import React, { useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Navigation from './Navigation';
import '../styles/general.css';
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
        // Fetch course progress
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

  // Calculate overall course progress
  const calculateCourseProgress = () => {
    if (!courseProgress || Object.keys(courseProgress).length === 0) {
      return 0;
    }
    
    const totalProgress = Object.values(courseProgress).reduce((sum, course) => 
      sum + (course.progressPercentage || 0), 0);
    
    return Math.round(totalProgress / Object.keys(courseProgress).length);
  };

  const overallCourseProgress = calculateCourseProgress();

  return (
    <div className="d-flex vh-100">
      <Navigation handleLogout={handleLogout} />
      <div className="flex-grow-1 p-4">
        <h2>Welcome, {user ? user.displayName || 'User' : 'Guest'}!</h2>
        <hr />
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="text-white card p-4 shadow-sm h-100">
              <h4 className="mb-3">Learning Progress</h4>
              <div className="row">
                <div className="col-md-6">
                  <h5 className="text-center">Skills</h5>
                  <ProgressTracker />
                </div>
                <div className="col-md-6">
                  <h5 className="text-center">Courses</h5>
                  {loadingCourses ? (
                    <div className="d-flex justify-content-center">
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <CourseProgressTracker overallProgress={overallCourseProgress} courseProgress={courseProgress} />
                  )}
                </div>
              </div>
              <div className="text-center mt-3">
                <div className="d-flex gap-2 justify-content-center">
                  <button 
                    className="btn btn-outline-light"
                    onClick={() => navigate('/skilltree')}
                  >
                    View Skill Tree
                  </button>
                  <button 
                    className="btn btn-outline-light"
                    onClick={() => navigate('/learn')}
                  >
                    View Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="text-white card p-4 shadow-sm h-100">
              <h4 className="mb-3">Daily Challenge</h4>
              {challengeLoading ? (
                <div className="d-flex justify-content-center">
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
                  {challenge.createdAt && challenge.createdAt.toDate && (
                    <p className="text-muted">
                      <small>Posted: {challenge.createdAt.toDate().toLocaleDateString()}</small>
                    </p>
                  )}
                  <div className="mt-3">
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/daily-challenge')}
                    >
                      Solve Challenge
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-12">
            <div className="text-white card p-4 shadow-sm">
              <h4 className="mb-3">Quick Access</h4>
              <div className="d-flex gap-3 flex-wrap">
                <button 
                  className="btn btn-outline-light"
                  onClick={() => navigate('/learn')}
                >
                  Learning Resources
                </button>
                <button 
                  className="btn btn-outline-light"
                  onClick={() => navigate('/communities')}
                >
                  Community
                </button>
                <button 
                  className="btn btn-outline-light"
                  onClick={() => navigate('/profile')}
                >
                  My Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
