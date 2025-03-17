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

  const getInitialCode = useCallback((lang) => {
    switch (lang) {
      case 'javascript':
        return `function solve(input) {
  
  return result;
}`;
      case 'python':
        return `def solve(input):
    
    return result`;
      case 'c':
        return `#include <stdio.h>

int solve(int input) {
    
    return result;
}`;
      default:
        return '';
    }
  }, []);

  const loadUserAttempts = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user || !challenge) return;
      
      const attemptRef = doc(db, 'challengeAttempts', user.uid);
      const attemptSnap = await getDoc(attemptRef);
      
      if (attemptSnap.exists() && attemptSnap.data().attempts) {
        const allAttempts = attemptSnap.data().attempts;
        setAttemptHistory(allAttempts);
        
        if (challenge) {
          const currentAttempt = allAttempts.find(a => a.challengeId === challenge.id);
          if (currentAttempt) {
            setUserAttempt(currentAttempt);
            setCode(currentAttempt.code || getInitialCode(currentAttempt.language || 'javascript'));
            setLanguage(currentAttempt.language || 'javascript');
            return;
          }
        }
      }
      
      if (challenge) {
        setCode(getInitialCode(language));
      }
    } catch (error) {
      console.error('Error loading user attempts:', error);
    }
  }, [challenge, language, getInitialCode]);

  useEffect(() => {
    if (challenge) {
      setUserAttempt(null);
      setFeedback(null);
      loadUserAttempts();
    }
  }, [challenge, loadUserAttempts]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }
    
    setUserId(user.uid);
  }, [navigate]);

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
    let isCorrect = false;
    let feedbackMessage = "";
    
    try {
      switch (challenge.id) {
        case 'reverse-string':
          if (language === 'javascript') {
            isCorrect = (
              (code.includes('.split') && code.includes('.reverse') && code.includes('.join')) ||
              (code.includes('for') && /\w+\s*=\s*\w+\s*\+\s*\w+/.test(code) && /\w+\s*--/.test(code)) ||
              (code.includes('Array.from') && code.includes('.reverse'))
            ) && !code.includes('print("")');
          } else if (language === 'python') {
            isCorrect = (
              code.includes('[::-1]') ||
              code.includes('reversed(') ||
              (code.includes('for') && code.includes('range') && code.includes('len') && code.includes('-1'))
            ) && !code.includes('print("")');
          } else if (language === 'c') {
            isCorrect = (
              (code.includes('char') && code.includes('strlen') && code.includes('for') && code.includes('temp')) ||
              // eslint-disable-next-line no-useless-escape
              (code.includes('for') && /\w+\s*=\s*\w+\s*[\-\+]\s*\w+/.test(code))
            ) && !code.includes('print("")');
          }
          break;
          
        case 'sum-array':
          if (language === 'javascript') {
            isCorrect = (
              code.includes('.reduce') ||
              (code.includes('for') && /\w+\s*\+=\s*\w+/.test(code)) ||
              (code.includes('.forEach') && /\w+\s*\+=\s*\w+/.test(code))
            ) && !code.includes('print("")');
          } else if (language === 'python') {
            isCorrect = (
              code.includes('sum(') || 
              (code.includes('for') && /\w+\s*\+=\s*\w+/.test(code))
            ) && !code.includes('print("")');
          } else if (language === 'c') {
            isCorrect = (code.includes('for') && /\w+\s*\+=\s*\w+/.test(code)) && !code.includes('print("")');
          }
          break;
          
        case 'palindrome':
          if (language === 'javascript') {
            isCorrect = (
              (code.toLowerCase().includes('.tolowercase') && code.includes('.split') && code.includes('.reverse') && code.includes('.join') && code.includes('===')) ||
              (code.includes('for') && code.includes('length') && /\w+\[\w+\]\s*!==\s*\w+\[\w+\]/.test(code))
            ) && !code.includes('print("")');
          } else if (language === 'python') {
            isCorrect = (
              (code.toLowerCase().includes('.lower') && (code.includes('[::-1]') || code.includes('reversed('))) ||
              (code.includes('for') && code.includes('range') && code.includes('len'))
            ) && !code.includes('print("")');
          } else if (language === 'c') {
            isCorrect = (
              (code.includes('for') && code.includes('strlen') && /\w+\[\w+\]\s*!=\s*\w+\[\w+\]/.test(code))
            ) && !code.includes('print("")');
          }
          break;
          
        case 'fizz-buzz':
          if (language === 'javascript') {
            isCorrect = (
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
              (code.includes('.split') && code.includes('.sort') && code.includes('.join') && code.includes('===')) ||
              (code.includes('Map') || (code.includes('{}') && code.includes('[') && code.includes(']')))
            ) && !code.includes('print("")');
          } else if (language === 'python') {
            isCorrect = (
              (code.includes('sorted(') && code.includes('==')) || 
              code.includes('Counter') || 
              (code.includes('dict') || (code.includes('{') && code.includes('}')))
            ) && !code.includes('print("")');
          } else if (language === 'c') {
            isCorrect = (
              (code.includes('for') && code.includes('if') && /\w+\[\w+\]/.test(code))
            ) && !code.includes('print("")');
          }
          break;
          
        case 'two-sum':
          if (language === 'javascript') {
            isCorrect = (
              (code.includes('Map') || code.includes('{}')) && code.includes('for') && 
              (code.includes('return [') || code.includes('push('))
            ) && !code.includes('print("")');
          } else if (language === 'python') {
            isCorrect = (
              (code.includes('dict') || (code.includes('{') && code.includes('}'))) && code.includes('for') && 
              (code.includes('return [') || code.includes('append('))
            ) && !code.includes('print("")');
          } else if (language === 'c') {
            isCorrect = (
              code.includes('for') && code.includes('if') && /\w+\[\w+\]\s*\+\s*\w+\[\w+\]/.test(code)
            ) && !code.includes('print("")');
          }
          break;
          
        case 'longest-substring':
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
      
      const newAttempt = {
        challengeId: challenge.id,
        code,
        language,
        isCorrect,
        timestamp: new Date(),
        challengeName: challenge.name
      };
      
      let updatedHistory = [...attemptHistory];
      const existingIndex = updatedHistory.findIndex(a => a.challengeId === challenge.id);
      
      if (existingIndex >= 0) {
        updatedHistory[existingIndex] = newAttempt;
      } else {
        updatedHistory.push(newAttempt);
      }
      
      setAttemptHistory(updatedHistory);
      setUserAttempt(newAttempt);
      
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

  // Modify the return statements to include the body class
  // In the loading state:
  if (loading) {
    return (
      <>
        <div className="daily-challenge-body"></div>
        <div className="daily-challenge-wrapper">
          <div className="d-flex with-nav">
            <Navigation handleLogout={handleLogout} />
            <div className="flex-grow-1 p-4 d-flex justify-content-center align-items-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // In the main return:
  return (
    <>
      <div className="daily-challenge-body"></div>
      <div className="daily-challenge-wrapper">
        <div className="d-flex with-nav">
          <Navigation handleLogout={handleLogout} />
          <div className="flex-grow-1 p-4 overflow-auto">
            <div className="header-container d-flex justify-content-between align-items-center mb-4">
              <h2 style={{ margin: 0 }}>Daily Coding Challenge</h2>
              <button className="btn btn-secondary" onClick={() => setShowHistory(true)}>
                Show History
              </button>
            </div>
            <div>
              <button className="btn btn-primary me-2" onClick={handleRefreshChallenge}>
                Refresh Challenge
              </button>
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
              <div className="alert alert-secondary">
                No challenge available. Click "Refresh Challenge" to load a challenge.
              </div>
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
                    <div className="hint-section">
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
      </div>
    </>
  );
};

export default DailyChallenge;