import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import CircularProgress from './CircularProgress';
import '../styles/progress.css';

const ProgressTracker = () => {
  const [skillData, setSkillData] = useState([]);
  const [skillProgress, setSkillProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState({});

  // Define calculateProgress as a useCallback to prevent it from being recreated on every render
  const calculateProgress = useCallback(() => {
    const categories = {};
    let totalSkills = 0;
    let completedSkills = 0;
    
    // Group skills by category
    skillData.forEach(skill => {
      const category = skill.category || 'General';
      
      if (!categories[category]) {
        categories[category] = {
          total: 0,
          completed: 0
        };
      }
      
      categories[category].total++;
      totalSkills++;
      
      if (skillProgress[skill.id]?.completed) {
        categories[category].completed++;
        completedSkills++;
      }
    });
    
    // Calculate percentages for each category
    const categoryPercentages = {};
    Object.keys(categories).forEach(category => {
      const { total, completed } = categories[category];
      categoryPercentages[category] = total > 0 ? (completed / total) * 100 : 0;
    });
    
    // Calculate overall progress
    const overall = totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0;
    
    setOverallProgress(overall);
    setCategoryProgress(categoryPercentages);
  }, [skillData, skillProgress]);

  useEffect(() => {
    const fetchSkillData = async () => {
      try {
        setLoading(true);
        
        // Fetch the skill tree structure
        const skillTreeRef = collection(db, 'skillTree');
        const skillTreeSnapshot = await getDocs(skillTreeRef);
        
        if (skillTreeSnapshot.empty) {
          console.log('No skill tree data found.');
          setSkillData([]);
          setLoading(false);
          return;
        }
        
        const skillTreeData = skillTreeSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setSkillData(skillTreeData);
        
        // Fetch user progress if logged in
        const user = auth.currentUser;
        if (user) {
          const progressRef = doc(db, 'skillProgress', user.uid);
          const progressSnap = await getDoc(progressRef);
          
          if (progressSnap.exists()) {
            const userData = progressSnap.data();
            setSkillProgress(userData.skills || {});
          }
        }
      } catch (error) {
        console.error('Error fetching skill data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkillData();
  }, []);

  useEffect(() => {
    if (!loading && skillData.length > 0) {
      calculateProgress();
    }
  }, [skillData, skillProgress, loading, calculateProgress]); // Added calculateProgress as a dependency

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading progress...</span>
        </div>
      </div>
    );
  }

  if (skillData.length === 0) {
    return (
      <div className="progress-tracker">
        <div className="alert alert-info">
          No skill data available. Please check the skill tree page to initialize your learning journey.
        </div>
      </div>
    );
  }

  return (
    <div className="progress-tracker">
      <div className="progress-overview">
        <div className="main-progress">
          <CircularProgress 
            percentage={overallProgress} 
            size={100} 
            strokeWidth={8}
          />
        </div>
        
        <div className="category-progress-container">
          {Object.keys(categoryProgress).map(category => (
            <div key={category} className="category-progress-item">
              <CircularProgress 
                percentage={categoryProgress[category]} 
                size={80}
                strokeWidth={6}
                color={category === 'Programming Basics' ? '#ff9800' : 
                      category === 'Web Development' ? '#2196f3' : 
                      category === 'Algorithms' ? '#f44336' : 
                      category === 'Data Structures' ? '#9c27b0' : '#4caf50'}
              />
              <h6>{category}</h6>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
