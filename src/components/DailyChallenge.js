import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const timestampToday = Timestamp.fromDate(today);

        const q = query(collection(db, 'challenges'), where('createdAt', '>=', timestampToday));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const challengeData = querySnapshot.docs[0].data();
          setChallenge(challengeData);
        } else {
          console.log('No challenge found for today.');
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, []);

  if (loading) return <p>Loading challenge...</p>;
  if (!challenge) return <p>No challenge available today.</p>;

  return (
    <div className="card p-3 shadow-sm">
      <h5>🚀 Daily Challenge</h5>
      <p><strong>{challenge.name}</strong></p>
      <p>{challenge.description}</p>
      <p><small>📅 {challenge.createdAt.toDate().toISOString().split('T')[0]}</small></p>
    </div>
  );
};

export default DailyChallenge;
