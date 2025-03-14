import React, { useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Modal, Button } from 'react-bootstrap';
import Navigation from './Navigation';
import '../styles/general.css';
import '../styles/dailyChallenge.css';
import { DailyChallengeContext } from '../DailyChallengeContext';
import { Editor } from '@monaco-editor/react';

const DailyChallenge = () => {
  const { challenge, loading, fetchRandomChallenge } = useContext(DailyChallengeContext);
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [userAttempt, setUserAttempt] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [userId, setUserId] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Helper function for initial code template - wrap in useCallback
  const getInitialCode = useCallback((lang) => {
    switch (lang) {
      case 'javascript':
        return `// Write your JavaScript solution here
function solve(input) {
  // Your code here
  
  return result;
}

// Example usage:
// solve(challenge.example)`;
      case 'python':
        return `# Write your Python solution here
def solve(input):
    # Your code here
    
    return result

# Example usage:
# solve(challenge.example)`;
      case 'c':
        return `// Write your C solution here
#include <stdio.h>

int solve(int input) {
    // Your code here
    
    return result;
}

// In main() you would call:
// int result = solve(challenge.example);`;
      default:
        return '// Write your solution here';
    }
  }, []); // Empty dependency array as it doesn't depend on any state or props

  // Move loadUserAttempts to useCallback to prevent it from being recreated on each render
  const loadUserAttempts = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user || !challenge) return;
      
      const attemptRef = doc(db, 'challengeAttempts', user.uid);
      const attemptSnap = await getDoc(attemptRef);
      
      if (attemptSnap.exists() && attemptSnap.data().attempts) {
        const allAttempts = attemptSnap.data().attempts;
        setAttemptHistory(allAttempts);
        
        // Find current challenge attempt if it exists
        if (challenge) {
          const currentAttempt = allAttempts.find(a => a.challengeId === challenge.id);
          if (currentAttempt) {
            setUserAttempt(currentAttempt);
            setCode(currentAttempt.code || getInitialCode(currentAttempt.language || 'javascript'));
            setLanguage(currentAttempt.language || 'javascript');
            return; // Exit early if we have an existing attempt
          }
        }
      }
      
      // If no existing attempt is found, initialize with default code
      if (challenge) {
        setCode(getInitialCode(language));
      }
    } catch (error) {
      console.error('Error loading user attempts:', error);
    }
  }, [challenge, language, getInitialCode]); // Now getInitialCode is properly memoized

  // Reset state when challenge changes
  useEffect(() => {
    if (challenge) {
      setUserAttempt(null);
      setFeedback(null);
      loadUserAttempts();
    }
  }, [challenge, loadUserAttempts]); // Add loadUserAttempts as dependency

  useEffect(() => {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }
    
    setUserId(user.uid);
  }, [navigate]);

  // Custom refresh function that resets state
  const handleRefreshChallenge = () => {
    fetchRandomChallenge();
    setUserAttempt(null);
    setFeedback(null);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(getInitialCode(newLanguage));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleSubmit = async () => {
    // More robust validation that checks for actual algorithm implementation
    let isCorrect = false;
    let feedbackMessage = "";
    
    try {
      // Create custom validation for each challenge type
      switch (challenge.id) {
        case 'reverse-string':
          // Check for actual string reversal implementation, not just keywords
          if (language === 'javascript') {
            isCorrect = (
              // Split, reverse, join approach
              (code.includes('.split') && code.includes('.reverse') && code.includes('.join')) ||
              // Manual character-by-character approach
              (code.includes('for') && /\w+\s*=\s*\w+\s*\+\s*\w+/.test(code) && /\w+\s*--/.test(code)) ||
              // Using Array.from with reverse
              (code.includes('Array.from') && code.includes('.reverse'))
            ) && !code.includes('print("")'); // Prevent empty print from falsely validating
          } else if (language === 'python') {
            isCorrect = (
              // Slice with negative step
              code.includes('[::-1]') ||
              // Reversed and join
              code.includes('reversed(') ||
              // Manual loop implementation
              (code.includes('for') && code.includes('range') && code.includes('len') && code.includes('-1'))
            ) && !code.includes('print("")'); // Prevent empty print from falsely validating
          } else if (language === 'c') {
            isCorrect = (
              // Character swapping approach
              (code.includes('char') && code.includes('strlen') && code.includes('for') && code.includes('temp')) ||
              // Manual reversing with indexes
              // eslint-disable-next-line no-useless-escape
              (code.includes('for') && /\w+\s*=\s*\w+\s*[\-\+]\s*\w+/.test(code))
            ) && !code.includes('print("")'); // Prevent empty print from falsely validating
          }
          break;
          
        case 'sum-array':
          if (language === 'javascript') {
            isCorrect = (
              // Reduce approach
              code.includes('.reduce') ||
              // For loop with accumulator
              (code.includes('for') && /\w+\s*\+=\s*\w+/.test(code)) ||
              // ForEach with accumulator
              (code.includes('.forEach') && /\w+\s*\+=\s*\w+/.test(code))
            ) && !code.includes('print("")');
          } else if (language === 'python') {
            isCorrect = (
              // Sum function
              code.includes('sum(') || 
              // For loop with accumulation
              (code.includes('for') && /\w+\s*\+=\s*\w+/.test(code))
            ) && !code.includes('print("")');
          } else if (language === 'c') {
            isCorrect = (code.includes('for') && /\w+\s*\+=\s*\w+/.test(code)) && !code.includes('print("")');
          }
          break;
          
        case 'palindrome':
          if (language === 'javascript') {
            isCorrect = (
              // Convert to lowercase, reverse and compare approach
              (code.toLowerCase().includes('.tolowercase') && code.includes('.split') && code.includes('.reverse') && code.includes('.join') && code.includes('===')) ||
              // Two-pointer technique
              (code.includes('for') && code.includes('length') && /\w+\[\w+\]\s*!==\s*\w+\[\w+\]/.test(code))
            ) && !code.includes('print("")');
          } else if (language === 'python') {
            isCorrect = (
              // Simple reversed string comparison approach
              (code.toLowerCase().includes('.lower') && (code.includes('[::-1]') || code.includes('reversed('))) ||
              // Two-pointer technique
              (code.includes('for') && code.includes('range') && code.includes('len'))
            ) && !code.includes('print("")');
          } else if (language === 'c') {
            isCorrect = (
              // Character comparison approach
              (code.includes('for') && code.includes('strlen') && /\w+\[\w+\]\s*!=\s*\w+\[\w+\]/.test(code))
            ) && !code.includes('print("")');
          }
          break;
          
        case 'fizz-buzz':
          if (language === 'javascript') {
            isCorrect = (
              // Check for modulo operators and conditional logic
              code.includes('%') && code.includes('Fizz') && code.includes('Buzz') && 
              code.includes('for') && 
              (code.includes('if') || code.includes('?'))
            ) && !code.includes('print("")');
          } else if (language === 'python') {
            isCorrect = (
              code.includes('%') && code.includes('Fizz') && code.includes('Buzz') && 
              (code.includes('for') || code.includes('range')) && 
              code.includes('if')
            ) && !code.includes('print("")');
          } else if (language === 'c') {
            isCorrect = (
              code.includes('%') && code.includes('Fizz') && code.includes('Buzz') && 
              code.includes('for') && code.includes('if')
            ) && !code.includes('print("")');
          }
          break;
          
        case 'anagram-checker':
          if (language === 'javascript') {
            isCorrect = (
              // Sort and compare approach
              (code.includes('.split') && code.includes('.sort') && code.includes('.join') && code.includes('===')) ||
              // Character frequency map approach
              (code.includes('Map') || (code.includes('{}') && code.includes('[') && code.includes(']')))
            ) && !code.includes('print("")');
          } else if (language === 'python') {
            isCorrect = (
              // Sort and compare approach
              (code.includes('sorted(') && code.includes('==')) || 
              // Counter approach
              code.includes('Counter') || 
              // Dictionary comparison approach
              (code.includes('dict') || (code.includes('{') && code.includes('}')))
            ) && !code.includes('print("")');
          } else if (language === 'c') {
            isCorrect = (
              // Character counting approach in C
              (code.includes('for') && code.includes('if') && /\w+\[\w+\]/.test(code))
            ) && !code.includes('print("")');
          }
          break;
          
        case 'two-sum':
          if (language === 'javascript') {
            isCorrect = (
              // Map approach
              (code.includes('Map') || code.includes('{}')) && code.includes('for') && 
              (code.includes('return [') || code.includes('push('))
            ) && !code.includes('print("")');
          } else if (language === 'python') {
            isCorrect = (
              // Dictionary approach
              (code.includes('dict') || (code.includes('{') && code.includes('}'))) && code.includes('for') && 
              (code.includes('return [') || code.includes('append('))
            ) && !code.includes('print("")');
          } else if (language === 'c') {
            isCorrect = (
              // Nested loop approach is most common in C
              code.includes('for') && code.includes('if') && /\w+\[\w+\]\s*\+\s*\w+\[\w+\]/.test(code)
            ) && !code.includes('print("")');
          }
          break;
          
        case 'longest-substring':
          // This is a more complex problem, checking for sliding window implementation
          if (language === 'javascript') {
            isCorrect = (
              // eslint-disable-next-line no-mixed-operators
              (code.includes('Map') || code.includes('Set') || code.includes('{}')) && 
              (code.includes('for') || code.includes('while')) && 
              /Math\.max\(\w+,\s*\w+\)/.test(code)
            ) && !code.includes('print("")');
          } else if (language === 'python') {
            isCorrect = (
              // eslint-disable-next-line no-mixed-operators
              (code.includes('dict') || code.includes('set') || (code.includes('{') && code.includes('}'))) && 
              (code.includes('for') || code.includes('while')) && 
              code.includes('max(')
            ) && !code.includes('print("")');
          } else if (language === 'c') {
            isCorrect = (
              code.includes('for') && code.includes('if') && 
              // eslint-disable-next-line no-mixed-operators
              (code.includes('memset') || /\w+\[\w+\]/.test(code))
            ) && !code.includes('print("")');
          }
          break;
          
        default:
          // For other challenges, require more substantial code and reject trivial solutions
          isCorrect = (
            code.trim().length > 100 && 
            // eslint-disable-next-line no-mixed-operators
            (code.includes('function') || code.includes('def') || code.includes('int') || code.includes('void')) && 
            (code.includes('for') || code.includes('while') || code.includes('if')) && 
            // eslint-disable-next-line no-mixed-operators
            (code.includes('return') || code.includes('print'))
          ) && !code.includes('print("")');
      }
      
      feedbackMessage = isCorrect ? 
        "Great job! Your solution appears to be correct!" : 
        "Your solution doesn't appear to be correct. Make sure you're implementing the required algorithm.";
      
      // Save the attempt
      const newAttempt = {
        challengeId: challenge.id,
        code,
        language,
        isCorrect,
        timestamp: new Date(),
        challengeName: challenge.name
      };
      
      // Update attempt history
      let updatedHistory = [...attemptHistory];
      const existingIndex = updatedHistory.findIndex(a => a.challengeId === challenge.id);
      
      if (existingIndex >= 0) {
        updatedHistory[existingIndex] = newAttempt;
      } else {
        updatedHistory.push(newAttempt);
      }
      
      setAttemptHistory(updatedHistory);
      setUserAttempt(newAttempt);
      
      // Save to Firestore
      await setDoc(doc(db, 'challengeAttempts', userId), {
        attempts: updatedHistory
      }, { merge: true });
      
    } catch (error) {
      console.error('Error validating solution:', error);
      feedbackMessage = "Error checking your solution. Please try again.";
    }
    
    setFeedback({
      message: feedbackMessage,
      status: isCorrect ? 'success' : 'error'
    });
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Daily Coding Challenge</h2>
          <div>
            <button className="btn btn-primary me-2" onClick={handleRefreshChallenge}>
              Refresh Challenge
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowHistory(true)}
            >
              Show History
            </button>
          </div>
        </div>
        
        {/* History Modal */}
        <Modal 
          show={showHistory} 
          onHide={() => setShowHistory(false)} 
          size="lg" 
          backdrop="static"
          className="challenge-history-modal"
        >
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>Your Challenge History</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            {attemptHistory.length === 0 ? (
              <p>No previous attempts recorded.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark">
                  <thead>
                    <tr>
                      <th>Challenge</th>
                      <th>Language</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attemptHistory.map((attempt, index) => (
                      <tr key={index}>
                        <td>{attempt.challengeName}</td>
                        <td>{attempt.language}</td>
                        <td>
                          <span className={`badge bg-${attempt.isCorrect ? 'success' : 'danger'}`}>
                            {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </td>
                        <td>{attempt.timestamp?.seconds ? new Date(attempt.timestamp.seconds * 1000).toLocaleDateString() : 'Unknown'}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-light"
                            onClick={() => {
                              setCode(attempt.code);
                              setLanguage(attempt.language);
                              setShowHistory(false);
                            }}
                          >
                            View Code
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-dark text-white">
            <Button variant="secondary" onClick={() => setShowHistory(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        
        {!challenge ? (
          <div className="alert alert-secondary">No challenge available. Click "Refresh Challenge" to load a challenge.</div>
        ) : (
          <div className="challenge-container">
            <div className="challenge-details bg-dark text-white p-4 rounded mb-4">
              <h3>{challenge.name}</h3>
              <p className="challenge-description">{challenge.description}</p>
              
              {challenge.example && (
                <div className="example-section">
                  <h5>Example:</h5>
                  <div className="example-code">
                    <code>{challenge.example}</code>
                  </div>
                </div>
              )}
              
              {challenge.hint && (
                <div className="hint-section mt-3">
                  <h5>Hint:</h5>
                  <p>{challenge.hint}</p>
                </div>
              )}
              
              {challenge.createdAt && challenge.createdAt.toDate && (
                <p className="text-muted mt-3">
                  <small>Posted: {challenge.createdAt.toDate().toLocaleDateString()}</small>
                </p>
              )}
              
              {userAttempt && (
                <div className={`alert alert-${userAttempt.isCorrect ? 'success' : 'warning'} mt-3`}>
                  You have {userAttempt.isCorrect ? 'successfully completed' : 'attempted'} this challenge.
                </div>
              )}
            </div>
            
            <div className="solution-section bg-dark p-4 rounded">
              <div className="d-flex justify-content-between mb-3">
                <h4>Your Solution</h4>
                <select 
                  className="form-select form-select-sm language-selector"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="c">C</option>
                </select>
              </div>
              
              <div className="editor-container">
                <Editor
                  height="400px"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: 'on'
                  }}
                />
              </div>
              
              <div className="mt-3 d-flex justify-content-between">
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit Solution
                </button>
                
                {userAttempt && userAttempt.isCorrect && (
                  <span className="text-success d-flex align-items-center">
                    <i className="fa fa-check-circle me-2"></i> Solved!
                  </span>
                )}
              </div>
              
              {feedback && (
                <div className={`alert alert-${feedback.status === 'success' ? 'success' : 'danger'} mt-3`}>
                  {feedback.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenge;
