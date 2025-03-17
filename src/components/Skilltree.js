import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import Navigation from './Navigation';
import '../styles/general.css';
import '../styles/skilltree.css';
import { doc, getDoc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';

const SkillTreePage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [skills, setSkills] = useState({});
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillData, setSkillData] = useState([]);
  const [skillMap, setSkillMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Initialize skill tree data in Firestore if it doesn't exist
  // Define this function first before it's referenced in fetchSkillTreeData
  const initializeSkillTreeData = useCallback(async () => {
    try {
      const defaultSkillTree = [
        {
          id: 'programming-basics',
          title: 'Programming Basics',
          description: 'Learn the fundamentals of programming',
          children: ['data-structures', 'algorithms'],
          dependencies: [],
          category: 'Programming Basics'
        },
        {
          id: 'data-structures',
          title: 'Data Structures',
          description: 'Understanding data structures is critical for efficient programming',
          children: ['arrays', 'linked-lists', 'stacks-queues', 'trees', 'graphs'],
          dependencies: ['programming-basics'],
          category: 'Data Structures'
        },
        {
          id: 'algorithms',
          title: 'Algorithms',
          description: 'Step-by-step procedures for solving problems',
          children: ['sorting', 'searching', 'dynamic-programming', 'greedy-algorithms'],
          dependencies: ['programming-basics'],
          category: 'Algorithms'
        },
        {
          id: 'arrays',
          title: 'Arrays',
          description: 'Fundamental data structure for storing sequences of elements',
          children: [],
          dependencies: ['data-structures'],
          category: 'Data Structures'
        },
        {
          id: 'linked-lists',
          title: 'Linked Lists',
          description: 'Linear data structure where elements are stored in nodes',
          children: [],
          dependencies: ['data-structures'],
          category: 'Data Structures'
        },
        {
          id: 'stacks-queues',
          title: 'Stacks & Queues',
          description: 'LIFO and FIFO data structures',
          children: [],
          dependencies: ['data-structures'],
          category: 'Data Structures'
        },
        {
          id: 'trees',
          title: 'Trees',
          description: 'Hierarchical data structures',
          children: ['binary-trees', 'binary-search-trees'],
          dependencies: ['data-structures'],
          category: 'Data Structures'
        },
        {
          id: 'binary-trees',
          title: 'Binary Trees',
          description: 'Trees with at most two children per node',
          children: [],
          dependencies: ['trees'],
          category: 'Data Structures'
        },
        {
          id: 'binary-search-trees',
          title: 'Binary Search Trees',
          description: 'Ordered binary trees for fast lookup',
          children: [],
          dependencies: ['trees'],
          category: 'Data Structures'
        },
        {
          id: 'graphs',
          title: 'Graphs',
          description: 'Non-linear data structures consisting of nodes and edges',
          children: [],
          dependencies: ['data-structures'],
          category: 'Data Structures'
        },
        {
          id: 'sorting',
          title: 'Sorting',
          description: 'Methods for ordering elements',
          children: ['bubble-sort', 'merge-sort', 'quick-sort'],
          dependencies: ['algorithms'],
          category: 'Algorithms'
        },
        {
          id: 'bubble-sort',
          title: 'Bubble Sort',
          description: 'Simple sorting algorithm that repeatedly steps through the list',
          children: [],
          dependencies: ['sorting'],
          category: 'Algorithms'
        },
        {
          id: 'merge-sort',
          title: 'Merge Sort',
          description: 'Efficient, stable, divide and conquer sorting algorithm',
          children: [],
          dependencies: ['sorting'],
          category: 'Algorithms'
        },
        {
          id: 'quick-sort',
          title: 'Quick Sort',
          description: 'Fast, divide and conquer sorting algorithm',
          children: [],
          dependencies: ['sorting'],
          category: 'Algorithms'
        },
        {
          id: 'searching',
          title: 'Searching',
          description: 'Methods for finding elements',
          children: ['linear-search', 'binary-search'],
          dependencies: ['algorithms'],
          category: 'Algorithms'
        },
        {
          id: 'linear-search',
          title: 'Linear Search',
          description: 'Simple search checking each element sequentially',
          children: [],
          dependencies: ['searching'],
          category: 'Algorithms'
        },
        {
          id: 'binary-search',
          title: 'Binary Search',
          description: 'Faster search algorithm for sorted arrays',
          children: [],
          dependencies: ['searching'],
          category: 'Algorithms'
        },
        {
          id: 'web-development',
          title: 'Web Development',
          description: 'Learn to build web applications',
          children: ['frontend', 'backend'],
          dependencies: [],
          category: 'Web Development'
        }
      ];
      
      // Add the default skill tree to Firestore
      const batch = writeBatch(db);
      defaultSkillTree.forEach(skill => {
        const skillRef = doc(db, 'skillTree', skill.id);
        batch.set(skillRef, skill);
      });
      
      await batch.commit();
      console.log('Default skill tree initialized');
      
      // Return the default data so we can set it
      return defaultSkillTree;
    } catch (error) {
      console.error('Error initializing skill tree data:', error);
      return [];
    }
  }, []);

  // Fetch skill tree data from Firestore
  const fetchSkillTreeData = useCallback(async () => {
    try {
      const skillTreeRef = collection(db, 'skillTree');
      const skillTreeSnapshot = await getDocs(skillTreeRef);
      
      if (!skillTreeSnapshot.empty) {
        const data = skillTreeSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setSkillData(data);
        
        // Create a map for easier access
        const map = {};
        data.forEach(skill => {
          map[skill.id] = skill;
        });
        setSkillMap(map);
      } else {
        console.log('No skill tree data found. Initializing with default data.');
        const defaultData = await initializeSkillTreeData();
        
        setSkillData(defaultData);
        
        // Create a map for easier access
        const map = {};
        defaultData.forEach(skill => {
          map[skill.id] = skill;
        });
        setSkillMap(map);
      }
    } catch (error) {
      console.error('Error fetching skill tree data:', error);
    }
  }, [initializeSkillTreeData]); // Added initializeSkillTreeData as dependency

  // Define loadProgress as useCallback to avoid dependency issues
  const loadProgress = useCallback(async (uid) => {
    if (!uid) return;
    
    try {
      const docRef = doc(db, 'skillProgress', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().skills) {
        const existingSkills = docSnap.data().skills;
        
        // Ensure root skills are properly set as available (but not completed by default)
        const updatedSkills = { ...existingSkills };
        let needsUpdate = false;
        
        skillData.forEach(skill => {
          if (skill.dependencies.length === 0) {
            // If it's a root skill and doesn't exist yet in the user's skills
            if (!updatedSkills[skill.id]) {
              updatedSkills[skill.id] = { completed: false, available: true };
              needsUpdate = true;
            } else if (updatedSkills[skill.id].available === undefined) {
              // If the skill exists but 'available' property is missing
              updatedSkills[skill.id].available = true;
              needsUpdate = true;
            }
          }
        });
        
        // If we had to fix any root skills, update Firestore
        if (needsUpdate) {
          await setDoc(doc(db, 'skillProgress', uid), {
            skills: updatedSkills,
            updatedAt: new Date()
          }, { merge: true });
        }
        
        setSkills(updatedSkills);
      } else {
        // Initialize with root skills as available but not completed
        const initialSkills = {};
        skillData.forEach(skill => {
          if (skill.dependencies.length === 0) {
            // Make root skills available but not completed by default
            initialSkills[skill.id] = { completed: false, available: true };
          } else {
            initialSkills[skill.id] = { completed: false, available: false };
          }
        });
        
        setSkills(initialSkills);
        
        // Save this initial state to Firestore
        if (uid) {
          await setDoc(doc(db, 'skillProgress', uid), {
            skills: initialSkills,
            updatedAt: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Error loading skill progress:', error);
    } finally {
      setLoading(false);
    }
  }, [skillData]);

  useEffect(() => {
    // First fetch the skill tree data
    fetchSkillTreeData();
  }, [fetchSkillTreeData]);
  
  useEffect(() => {
    // When skill data is loaded, load user progress
    if (skillData.length > 0) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUserId(user.uid);
          loadProgress(user.uid);
        } else {
          navigate('/login');
        }
      });
      return () => unsubscribe();
    }
  }, [navigate, loadProgress, skillData]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  // Save user progress to Firestore
  const saveProgress = async (skillsToSave = skills) => {
    if (!userId) return;
    
    try {
      await setDoc(doc(db, 'skillProgress', userId), {
        skills: skillsToSave,
        updatedAt: new Date()
      });
      console.log('Progress saved successfully!');
    } catch (error) {
      console.error('Error saving skill progress:', error);
    }
  };

  // Check if a skill is available to be completed
  const isSkillAvailable = useCallback((skillId) => {
    const skill = skillMap[skillId];
    if (!skill) return false;
    
    // If the skill has no dependencies, it's always available
    if (skill.dependencies.length === 0) {
      return true;
    }
    
    // Check if all dependencies are completed
    return skill.dependencies.every(depId => skills[depId]?.completed);
  }, [skillMap, skills]);

  // Toggle skill completion status
  const toggleSkillCompletion = (skillId) => {
    // Can only complete available skills
    if (!isSkillAvailable(skillId) && !skills[skillId]?.completed) {
      return;
    }
    
    const newSkills = { ...skills };
    const newCompletionStatus = !newSkills[skillId]?.completed;
    
    // First, update the clicked skill
    newSkills[skillId] = { 
      ...newSkills[skillId],
      completed: newCompletionStatus,
      available: true // Ensure the available flag is set correctly
    };
    
    // Handle root skills specially to ensure they can be properly toggled
    const skill = skillMap[skillId];
    if (skill && skill.dependencies.length === 0) {
      // Root skills are always available
      newSkills[skillId].available = true; 
    }
    
    // If we're marking as incomplete, recursively update all dependent skills
    if (!newCompletionStatus) {
      const updateDependentSkills = (parentId) => {
        skillData.forEach(skill => {
          if (skill.dependencies.includes(parentId)) {
            // If this skill depends on the parent (directly or indirectly)
            const skillId = skill.id;
            if (newSkills[skillId]?.completed) {
              newSkills[skillId] = {
                ...newSkills[skillId],
                completed: false,
                available: false
              };
              // Recursively update its dependents
              updateDependentSkills(skillId);
            }
          }
        });
      };
      
      updateDependentSkills(skillId);
    }
    
    // Update availability for all skills based on dependencies
    skillData.forEach(skill => {
      // Handle skills differently based on whether they're root skills
      if (skill.dependencies.length === 0) {
        // Ensure root skills have an entry and are available
        newSkills[skill.id] = {
          ...(newSkills[skill.id] || {}),
          available: true
        };
        // But don't change their completion status here
      } else {
        // For non-root skills, check if all dependencies are completed
        const available = skill.dependencies.every(depId => newSkills[depId]?.completed);
        
        newSkills[skill.id] = {
          ...(newSkills[skill.id] || {}),
          available: available,
        };
        
        // If not available and was previously marked completed, reset completion
        if (!available && newSkills[skill.id].completed) {
          newSkills[skill.id].completed = false;
        }
      }
    });
    
    setSkills(newSkills);
    
    // Save progress to Firestore with immediate update
    saveProgress(newSkills);
  };

  // Show skill details
  const showSkillDetails = (skillId) => {
    setSelectedSkill(skillMap[skillId]);
  };

  if (loading || skillData.length === 0) {
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
  
  // Get root skills (skills with no dependencies)
  const rootSkills = skillData.filter(skill => skill.dependencies.length === 0);

  return (
    <div className="d-flex with-nav">
      <Navigation handleLogout={handleLogout} />
      <div className="flex-grow-1 p-4 overflow-auto">
        <h2 className="mb-4">Skill Tree</h2>
        
        <div className="skill-tree-container">
          {/* Left - Skill Tree */}
          <div className="custom-skill-tree">
            <div className="tree-container p-4">
              <h3>Programming Path</h3>
              <div className="skill-category">
                {rootSkills.map(rootSkill => (
                  <div key={rootSkill.id} className="skill-branch mb-5">
                    <div 
                      className={`skill-node root-node ${skills[rootSkill.id]?.completed ? 'completed' : ''}`}
                      onClick={() => {
                        showSkillDetails(rootSkill.id);
                        toggleSkillCompletion(rootSkill.id);
                      }}
                    >
                      {rootSkill.title}
                    </div>
                    
                    <div className="children-container">
                      {rootSkill.children && rootSkill.children.map(childId => {
                        const childSkill = skillMap[childId];
                        if (!childSkill) return null;
                        
                        const isAvailable = skills[childId]?.available || isSkillAvailable(childId);
                        const isCompleted = skills[childId]?.completed;
                        
                        return (
                          <div key={childId} className="skill-branch level-1">
                            <div 
                              className={`skill-node ${isCompleted ? 'completed' : ''} ${isAvailable ? 'available' : 'locked'}`}
                              onClick={() => {
                                showSkillDetails(childId);
                                if (isAvailable) toggleSkillCompletion(childId);
                              }}
                            >
                              {childSkill.title}
                              {!isAvailable && <span className="lock-icon">🔒</span>}
                            </div>
                            
                            <div className="children-container">
                              {childSkill.children && childSkill.children.map(grandChildId => {
                                const grandChildSkill = skillMap[grandChildId];
                                if (!grandChildSkill) return null;
                                
                                const isGrandChildAvailable = skills[grandChildId]?.available || 
                                                             (isCompleted && isSkillAvailable(grandChildId));
                                const isGrandChildCompleted = skills[grandChildId]?.completed;
                                
                                return (
                                  <div key={grandChildId} className="skill-branch level-2">
                                    <div 
                                      className={`skill-node ${isGrandChildCompleted ? 'completed' : ''} ${isGrandChildAvailable ? 'available' : 'locked'}`}
                                      onClick={() => {
                                        showSkillDetails(grandChildId);
                                        if (isGrandChildAvailable) toggleSkillCompletion(grandChildId);
                                      }}
                                    >
                                      {grandChildSkill.title}
                                      {!isGrandChildAvailable && <span className="lock-icon">🔒</span>}
                                    </div>
                                    
                                    <div className="children-container">
                                      {grandChildSkill.children && grandChildSkill.children.map(greatGrandChildId => {
                                        const greatGrandChildSkill = skillMap[greatGrandChildId];
                                        if (!greatGrandChildSkill) return null;
                                        
                                        const isGreatGrandChildAvailable = skills[greatGrandChildId]?.available || 
                                                                        (isGrandChildCompleted && isSkillAvailable(greatGrandChildId));
                                        const isGreatGrandChildCompleted = skills[greatGrandChildId]?.completed;
                                        
                                        return (
                                          <div key={greatGrandChildId} className="skill-node-wrapper level-3">
                                            <div 
                                              className={`skill-node ${isGreatGrandChildCompleted ? 'completed' : ''} ${isGreatGrandChildAvailable ? 'available' : 'locked'}`}
                                              onClick={() => {
                                                showSkillDetails(greatGrandChildId);
                                                if (isGreatGrandChildAvailable) toggleSkillCompletion(greatGrandChildId);
                                              }}
                                            >
                                              {greatGrandChildSkill.title}
                                              {!isGreatGrandChildAvailable && <span className="lock-icon">🔒</span>}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Skill Details */}
          <div className="skill-details-wrapper">
            <div className="sticky-top" style={{ top: '1rem' }}>
              {selectedSkill ? (
                <div className="skill-details p-4 bg-dark text-white rounded">
                  <h4>{selectedSkill.title}</h4>
                  <p>{selectedSkill.description}</p>
                  <div className="skill-status mt-3">
                    <strong>Status:</strong> {skills[selectedSkill.id]?.completed ? 'Completed ✅' : 'Not Completed ❌'}
                  </div>
                  
                  {selectedSkill.children && selectedSkill.children.length > 0 && (
                    <div className="unlocks-section mt-3">
                      <strong>Unlocks:</strong>
                      <ul>
                        {selectedSkill.children.map(childId => {
                          const childSkill = skillMap[childId];
                          return childSkill ? (
                            <li key={childId}>{childSkill.title}</li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                  
                  {selectedSkill.dependencies && selectedSkill.dependencies.length > 0 && (
                    <div className="prerequisites-section mt-3">
                      <strong>Prerequisites:</strong>
                      <ul>
                        {selectedSkill.dependencies.map(depId => {
                          const depSkill = skillMap[depId];
                          return depSkill ? (
                            <li key={depId} className={skills[depId]?.completed ? 'text-success' : 'text-danger'}>
                              {depSkill.title} {skills[depId]?.completed ? '✓' : '✗'}
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                  
                  <button 
                    className={`btn ${skills[selectedSkill.id]?.completed ? 'btn-warning' : 'btn-success'} mt-3`}
                    onClick={() => toggleSkillCompletion(selectedSkill.id)}
                    disabled={!isSkillAvailable(selectedSkill.id) && !skills[selectedSkill.id]?.completed}
                  >
                    {skills[selectedSkill.id]?.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>
                </div>
              ) : (
                <div className="skill-details p-4 bg-dark text-white rounded">
                  <h4>Select a skill</h4>
                  <p>Click on any skill node to see its details and track your progress.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTreePage;
