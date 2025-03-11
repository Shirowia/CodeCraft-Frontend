import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import '../styles/general.css';

const Learn = () => {
  const navigate = useNavigate();
  const [learningResources, setLearningResources] = useState([]);
  const [courseraCourses, setCourseraCourses] = useState([
    {
      name: "Data Structures and Algorithms Specialization",
      description: "Learn to design, implement, and analyze algorithms for solving computational problems. This specialization covers data structures, algorithms, and complexity analysis.",
      slug: "data-structures-algorithms",
      completed: false,
    },
    {
      name: "Algorithms, Part I",
      description: "This course covers essential information about algorithms and data structures, with a focus on sorting and searching algorithms.",
      slug: "algorithms-part1",
      completed: false,
    },
    {
      name: "Algorithmic Toolbox",
      description: "Learn basic algorithmic techniques and ideas for computational problems, including greedy algorithms, dynamic programming, and divide-and-conquer.",
      slug: "algorithmic-toolbox",
      completed: false,
    },
    {
      name: "Data Structures and Performance",
      description: "Understand the performance of different data structures and how to choose the right one for your application.",
      slug: "data-structures-performance",
      completed: false,
    },
    {
      name: "Graph Search, Shortest Paths, and Data Structures",
      description: "Explore graph search algorithms, shortest path algorithms, and advanced data structures.",
      slug: "graph-search-shortest-paths",
      completed: false,
    },
  ]);

  useEffect(() => {
    const fetchResources = async () => {
      const resourcesCollection = collection(db, 'learningResources');
      const resourcesSnapshot = await getDocs(resourcesCollection);
      setLearningResources(resourcesSnapshot.docs.map(doc => doc.data()));
    };

    fetchResources();
  }, []);

  const handleCompletionChange = (index) => {
    const updatedCourses = [...courseraCourses];
    updatedCourses[index].completed = !updatedCourses[index].completed;
    setCourseraCourses(updatedCourses);
  };

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
      <Navigation handleLogout={handleLogout} />
      <div className="flex-grow-1 p-4">
        <h2>Learn to Code</h2>
        <hr />
        <div className="resources-section">
          <h2 className="section-title">Learning Resources</h2>
          <ul className="list-group resources-list">
            {learningResources.map((resource, index) => (
              <li key={index} className="list-group-item resource-item">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                  {resource.name}
                </a>
                <p className="resource-description">{resource.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="courses-section">
          <h2 className="section-title">Coursera Courses on Data Structures and Algorithms</h2>
          <ul className="list-group courses-list">
            {courseraCourses.map((course, index) => (
              <li key={index} className="bg-dark text-white list-group-item course-item">
                <a href={`https://www.coursera.org/learn/${course.slug}`} target="_blank" rel="noopener noreferrer" className="course-link">
                  {course.name}
                </a>
                <p className="course-description">{course.description}</p>
                <div className="completion-container">
                  <label className="completion-label">
                    Completed: 
                    <input
                      type="checkbox"
                      checked={course.completed}
                      onChange={() => handleCompletionChange(index)}
                      className="form-check-input completion-checkbox"
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Learn;