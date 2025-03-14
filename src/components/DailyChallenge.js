import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Removed unused imports
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

  // Helper function for initial code template
  const getInitialCode = (lang) => {
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
  };

  useEffect(() => {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }
    
    setUserId(user.uid);
    
    // Load user's previous attempts for this challenge if it exists
    const loadUserAttempts = async () => {
      try {
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
    };
    
    if (challenge) {
      loadUserAttempts();
    }
  }, [challenge, language, navigate]); // Added language to dependencies

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
    // Basic validation - check if the code contains the solution pattern for the challenge
    let isCorrect = false;
    let feedbackMessage = "";
    
    try {
      // This is a simplified validation that looks for expected patterns in the code
      // In a production app, you'd want to execute the code in a sandbox environment
      switch (challenge.id) {
        case 'reverse-string':
          isCorrect = code.includes('.reverse()') || code.includes('[::-1]') || 
                     (code.includes('for') && (code.includes('--') || code.includes('-=')));
          break;
        case 'sum-array':
          isCorrect = code.includes('.reduce') || code.includes('sum') || 
                     (code.includes('for') && code.includes('+='));
          break;
        case 'palindrome':
          isCorrect = code.includes('.reverse') || code.includes('[::-1]') || 
                     (code.includes('for') && code.includes('length'));
          break;
        default:
          // For other challenges, check if code is non-empty (basic check)
          isCorrect = code.trim().length > 50;
      }
      
      feedbackMessage = isCorrect ? 
        "Great job! Your solution appears to be correct!" : 
        "Your solution doesn't appear to include the expected approach. Try again!";
      
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
            <button className="btn btn-primary me-2" onClick={fetchRandomChallenge}>
              Refresh Challenge
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
        </div>
        
        {showHistory && (
          <div className="history-section bg-dark text-white rounded">
            <h4>Your Challenge History</h4>
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
                        <td>{new Date(attempt.timestamp.seconds * 1000).toLocaleDateString()}</td>
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
          </div>
        )}
        
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
