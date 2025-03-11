import React, { createContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase/firebase';

export const DailyChallengeContext = createContext();

export const DailyChallengeProvider = ({ children }) => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'challenges'));
      const challenges = querySnapshot.docs.map(doc => doc.data());

      if (challenges.length > 0) {
        const randomIndex = Math.floor(Math.random() * challenges.length);
        const selectedChallenge = challenges[randomIndex];
        setChallenge(selectedChallenge);
      } else {
        console.log('No challenges found.');
        setChallenge(null);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <DailyChallengeContext.Provider value={{ challenge, loading, fetchChallenges }}>
      {children}
    </DailyChallengeContext.Provider>
  );
};