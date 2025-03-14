import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import '../styles/general.css';
import '../styles/learn.css';

const Learn = () => {
  const navigate = useNavigate();
  const [learningResources, setLearningResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    const fetchUserAndData = async () => {
      setLoading(true);
      
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      
      setUserId(user.uid);
      
      try {
        // Fetch learning resources from Firestore
        const resourcesCollection = collection(db, 'learningResources');
        const resourcesSnapshot = await getDocs(resourcesCollection);
        setLearningResources(resourcesSnapshot.docs.map(doc => doc.data()));
        
        // Fetch courses from Firestore
        const coursesCollection = collection(db, 'courses');
        const coursesSnapshot = await getDocs(coursesCollection);
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);
        
        // Fetch tutorials from Firestore
        const tutorialsCollection = collection(db, 'tutorials');
        const tutorialsSnapshot = await getDocs(tutorialsCollection);
        const tutorialsData = tutorialsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTutorials(tutorialsData);

        // Fetch user's course progress
        const progressRef = doc(db, 'courseProgress', user.uid);
        const progressSnap = await getDoc(progressRef);
        
        let existingProgress = {};
        if (progressSnap.exists()) {
          existingProgress = progressSnap.data().courses || {};
        }
        
        // Ensure all courses have progress entries
        const initialProgress = {};
        coursesData.forEach(course => {
          initialProgress[course.id] = existingProgress[course.id] || {
            completed: false,
            progressPercentage: 0
          };
        });
        
        setCourseProgress(initialProgress);
        
        // Update/save progress to Firestore to ensure all courses are tracked
        await setDoc(doc(db, 'courseProgress', user.uid), {
          courses: initialProgress,
          updatedAt: new Date()
        }, { merge: true });
        
      } catch (error) {
        console.error('Error fetching learning data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndData();
  }, [navigate]);

  const handleProgressChange = async (courseId, value) => {
    if (!userId) return;
    
    const newProgress = { ...courseProgress };
    newProgress[courseId] = {
      ...newProgress[courseId],
      progressPercentage: parseInt(value, 10),
      completed: parseInt(value, 10) === 100
    };
    
    setCourseProgress(newProgress);
    
    try {
      await setDoc(doc(db, 'courseProgress', userId), {
        courses: newProgress,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving course progress:', error);
    }
  };

  const handleCompletionChange = async (courseId, completed) => {
    if (!userId) return;
    
    const newProgress = { ...courseProgress };
    newProgress[courseId] = {
      ...newProgress[courseId],
      completed,
      progressPercentage: completed ? 100 : (newProgress[courseId]?.progressPercentage || 0)
    };
    
    setCourseProgress(newProgress);
    
    try {
      await setDoc(doc(db, 'courseProgress', userId), {
        courses: newProgress,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving course completion:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  if (loading) {
    return (
      <div className="d-flex vh-100">
        <Navigation handleLogout={handleLogout} />
        <div className="flex-grow-1 p-4 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100">
      <Navigation handleLogout={handleLogout} />
      <div className="flex-grow-1 p-4 overflow-auto">
        <h2>Learn to Code</h2>
        <hr />
        
        <div className="resources-section">
          <h3 className="section-title">Learning Resources</h3>
          <ul className="list-group resources-list">
            {learningResources.map((resource, index) => (
              <li key={index} className="list-group-item resource-item bg-dark text-white">
                <h4>{resource.name}</h4>
                <p className="resource-description">{resource.description}</p>
                {resource.url && (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                    Visit Resource
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="courses-section mt-5">
          <h3 className="section-title">Recommended Courses</h3>
          <div className="accordion" id="coursesAccordion">
            {courses.map((course, index) => (
              <div className="accordion-item bg-dark text-white" key={course.id}>
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button 
                    className={`accordion-button bg-dark text-white ${activeAccordion !== index ? 'collapsed' : ''}`}
                    type="button" 
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={activeAccordion === index}
                    aria-controls={`collapse${index}`}
                  >
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{course.name}</span>
                        <span className="badge bg-primary">{courseProgress[course.id]?.progressPercentage || 0}% Complete</span>
                      </div>
                    </div>
                  </button>
                </h2>
                <div 
                  id={`collapse${index}`} 
                  className={`accordion-collapse collapse ${activeAccordion === index ? 'show' : ''}`}
                  aria-labelledby={`heading${index}`}
                >
                  <div className="accordion-body">
                    <div className="mb-3">
                      <h5>About This Course</h5>
                      <p>{course.description}</p>
                    </div>
                    
                    {course.overview && (
                      <div className="mb-3">
                        <h5>Course Overview</h5>
                        <p>{course.overview}</p>
                      </div>
                    )}
                    
                    {course.benefits && (
                      <div className="mb-3">
                        <h5>Benefits</h5>
                        <ul>
                          {course.benefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {course.drawbacks && (
                      <div className="mb-3">
                        <h5>Considerations</h5>
                        <ul>
                          {course.drawbacks.map((drawback, i) => (
                            <li key={i}>{drawback}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {course.topics && (
                      <div className="mb-3">
                        <h5>Key Topics</h5>
                        <ul>
                          {course.topics.map((topic, i) => (
                            <li key={i}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="course-progress mb-3">
                      <h5>Track Your Progress</h5>
                      <div className="progress-tracking">
                        <div className="progress">
                          <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{width: `${courseProgress[course.id]?.progressPercentage || 0}%`}}
                            aria-valuenow={courseProgress[course.id]?.progressPercentage || 0} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                          >
                            {courseProgress[course.id]?.progressPercentage || 0}%
                          </div>
                        </div>
                        <input 
                          type="range" 
                          className="form-range mt-2" 
                          min="0" 
                          max="100" 
                          value={courseProgress[course.id]?.progressPercentage || 0} 
                          onChange={(e) => handleProgressChange(course.id, e.target.value)}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id={`complete-${course.id}`} 
                              checked={courseProgress[course.id]?.completed || false}
                              onChange={(e) => handleCompletionChange(course.id, e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor={`complete-${course.id}`}>
                              Mark as completed
                            </label>
                          </div>
                          <a 
                            href={course.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-primary btn-sm"
                          >
                            Go to Course
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tutorials Section */}
        {tutorials.length > 0 && (
          <div className="tutorials-section mt-5">
            <h3 className="section-title">Interactive Tutorials</h3>
            <div className="row">
              {tutorials.map(tutorial => (
                <div key={tutorial.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card bg-dark text-white h-100">
                    <div className="card-body">
                      <h5 className="card-title">{tutorial.title}</h5>
                      <p className="card-text">{tutorial.description}</p>
                      <div className="d-flex justify-content-between mt-3">
                        <span className="badge bg-info">{tutorial.difficulty}</span>
                        <span className="badge bg-secondary">{tutorial.estimatedTime}</span>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button 
                        className="btn btn-primary w-100"
                        onClick={() => navigate(`/tutorial/${tutorial.id}`)}
                      >
                        Start Tutorial
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;