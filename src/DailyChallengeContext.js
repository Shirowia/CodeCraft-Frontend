import React, { createContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase/firebase';

export const DailyChallengeContext = createContext();

export const DailyChallengeProvider = ({ children }) => {
  const [challenge, setChallenge] = useState(null);
  const [allChallenges, setAllChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all challenges on initial load
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        
        // Get all challenges
        const challengesSnapshot = await getDocs(collection(db, 'challenges'));
        const challengesData = challengesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setAllChallenges(challengesData);
        
        // Get the current date at midnight for consistent daily challenge
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Use the date to select a deterministic challenge based on the day
        const dayOfYear = getDayOfYear(today);
        const challengeIndex = dayOfYear % challengesData.length;
        
        // Set today's challenge
        setChallenge(challengesData[challengeIndex]);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Get day of year (1-366)
  const getDayOfYear = (date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  // Function to get a random challenge different from the current one
  const fetchRandomChallenge = () => {
    if (allChallenges.length <= 1) return;
    
    setLoading(true);
    
    try {
      // Filter out the current challenge
      const availableChallenges = allChallenges.filter(c => 
        !challenge || c.id !== challenge.id
      );
      
      // Select a random challenge from the filtered list
      const randomIndex = Math.floor(Math.random() * availableChallenges.length);
      const newChallenge = availableChallenges[randomIndex];
      
      setChallenge(newChallenge);
    } catch (error) {
      console.error('Error fetching random challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DailyChallengeContext.Provider value={{ challenge, loading, fetchRandomChallenge }}>
      {children}
    </DailyChallengeContext.Provider>
  );
};