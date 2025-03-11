import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Learn = () => {
  const [learningResources, setLearningResources] = useState([]);
  const [courseraCourses, setCourseraCourses] = useState([
    {
      name: "Data Structures and Algorithms Specialization",
      description: "Learn to design, implement, and analyze algorithms for solving computational problems. This specialization covers data structures, algorithms, and complexity analysis.",
      slug: "data-structures-algorithms",
      progress: 0
    },
    {
      name: "Algorithms, Part I",
      description: "This course covers essential information about algorithms and data structures, with a focus on sorting and searching algorithms.",
      slug: "algorithms-part1",
      progress: 0
    },
    {
      name: "Algorithmic Toolbox",
      description: "Learn basic algorithmic techniques and ideas for computational problems, including greedy algorithms, dynamic programming, and divide-and-conquer.",
      slug: "algorithmic-toolbox",
      progress: 0
    },
    {
      name: "Data Structures and Performance",
      description: "Understand the performance of different data structures and how to choose the right one for your application.",
      slug: "data-structures-performance",
      progress: 0
    },
    {
      name: "Graph Search, Shortest Paths, and Data Structures",
      description: "Explore graph search algorithms, shortest path algorithms, and advanced data structures.",
      slug: "graph-search-shortest-paths",
      progress: 0
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

  const handleProgressChange = (index, progress) => {
    const updatedCourses = [...courseraCourses];
    updatedCourses[index].progress = progress;
    setCourseraCourses(updatedCourses);
  };

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
            <div>
              <label>
                Progress: 
                <input
                  type="number"
                  value={course.progress}
                  onChange={(e) => handleProgressChange(index, e.target.value)}
                  min="0"
                  max="100"
                />%
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Learn;