import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Learn = () => {
  const [learningResources, setLearningResources] = useState([]);
  const [courseraCourses, setCourseraCourses] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      const resourcesCollection = collection(db, 'learningResources');
      const resourcesSnapshot = await getDocs(resourcesCollection);
      setLearningResources(resourcesSnapshot.docs.map(doc => doc.data()));
    };

    const fetchCourseraCourses = async () => {
      try {
        const response = await fetch('https://<YOUR_FIREBASE_PROJECT_ID>.cloudfunctions.net/fetchCourseraCourses');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Coursera API response:', data);
        setCourseraCourses(data.elements);
      } catch (error) {
        console.error('Failed to fetch Coursera courses:', error);
      }
    };

    fetchResources();
    fetchCourseraCourses();
  }, []);

  return (
    <div>
      <h1>Learn to Code</h1>
      <ul>
        {learningResources.map((resource, index) => (
          <li key={index}>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              {resource.name}
            </a>
            : {resource.description}
          </li>
        ))}
      </ul>
      <h2>Coursera Courses on Data Structures and Algorithms</h2>
      <ul>
        {courseraCourses.map((course, index) => (
          <li key={index}>
            <a href={`https://www.coursera.org/learn/${course.slug}`} target="_blank" rel="noopener noreferrer">
              {course.name}
            </a>
            : {course.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Learn;