import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import Navigation from './Navigation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/general.css';
import '../styles/dailyChallenge.css';  // Using DailyChallenge stylesheet

const Tutorial = () => {
  const { tutorialId } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        setLoading(true);
        const tutorialRef = doc(db, 'tutorials', tutorialId);
        const tutorialSnap = await getDoc(tutorialRef);
        if (tutorialSnap.exists()) {
          setTutorial(tutorialSnap.data());
        } else {
          console.log('No such tutorial!');
        }
      } catch (error) {
        console.error('Error fetching tutorial:', error);
      } finally {
        setLoading(false);
      }
    };
    if (tutorialId) {
      fetchTutorial();
    }
  }, [tutorialId]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const handleNextSection = () => {
    if (currentSection < tutorial.content.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  if (loading) {
    return (
      <div className="d-flex vh-100">
        <Navigation handleLogout={handleLogout} />
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="d-flex vh-100">
        <Navigation handleLogout={handleLogout} />
        <div className="flex-grow-1 p-4">
          <div className="alert alert-danger">
            Tutorial not found.
            <button className="btn btn-link" onClick={() => navigate('/learn')}>
              Back to Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  const section = tutorial.content[currentSection];

  return (
    <>
      <div className="daily-challenge-body"></div>
      <div className="daily-challenge-wrapper">
        <div className="d-flex with-nav">
          <Navigation handleLogout={handleLogout} />
          <div className="flex-grow-1">
            {/* Fixed header at the top */}
            <div className="header-container d-flex justify-content-between align-items-center">
              <button className="btn btn-secondary" onClick={() => navigate('/learn')}>
                Back to Learning
              </button>
              <div className="text-center">
                <h2 className="mb-0">{tutorial.title}</h2>
                <div className="d-flex gap-2 justify-content-center mt-2">
                  <span className="badge bg-info">{tutorial.difficulty}</span>
                  <span className="badge bg-secondary">{tutorial.estimatedTime}</span>
                  <span className="badge bg-primary">
                    {currentSection + 1} of {tutorial.content.length}
                  </span>
                </div>
              </div>
              <div style={{ width: '120px' }}></div>
            </div>
            {/* Scrollable content container below header */}
            <div className="content-container">
              <div className="challenge-container">
                <h3>{section.section}</h3>
                <div className="tutorial-text my-4">
                  {section.text.split('\n').map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                </div>
                {section.codeExample && (
                  <div className="example-code">
                    <h5>Code Example</h5>
                    <SyntaxHighlighter
                      language={
                        tutorial.id?.includes('javascript')
                          ? 'javascript'
                          : tutorial.id?.includes('python')
                          ? 'python'
                          : tutorial.id?.includes('css')
                          ? 'css'
                          : 'text'
                      }
                      style={vscDarkPlus}
                      className="rounded"
                    >
                      {section.codeExample}
                    </SyntaxHighlighter>
                  </div>
                )}
                <div className="navigation-controls d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-primary nav-button"
                    disabled={currentSection === 0}
                    onClick={handlePreviousSection}
                  >
                    <i className="fa fa-arrow-left me-1"></i> Previous
                  </button>
                  <button
                    className="btn btn-primary nav-button"
                    disabled={currentSection === tutorial.content.length - 1}
                    onClick={handleNextSection}
                  >
                    Next <i className="fa fa-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tutorial;