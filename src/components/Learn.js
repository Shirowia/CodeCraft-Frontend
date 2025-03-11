import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Learn = () => {
  const [learningResources, setLearningResources] = useState([]);
  const [courseraCourses] = useState([
    {
      name: "Data Structures and Algorithms Specialization",
      description: "Learn to design, implement, and analyze algorithms for solving computational problems.",
      slug: "data-structures-algorithms"
    },
    {
      name: "Algorithms, Part I",
      description: "This course covers essential information about algorithms and data structures.",
      slug: "algorithms-part1"
    },
    {
      name: "Algorithmic Toolbox",
      description: "Learn basic algorithmic techniques and ideas for computational problems.",
      slug: "algorithmic-toolbox"
    }
  ]);

  useEffect(() => {
    const fetchResources = async () => {
      const resourcesCollection = collection(db, 'learningResources');
      const resourcesSnapshot = await getDocs(resourcesCollection);
      setLearningResources(resourcesSnapshot.docs.map(doc => doc.data()));
    };

    fetchResources();
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