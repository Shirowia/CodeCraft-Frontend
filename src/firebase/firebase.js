import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAC9zxvPZxVjAUjMSA753ckyhF5ONjKKhs",
  authDomain: "codecraft-29e84.firebaseapp.com",
  projectId: "codecraft-29e84",
  storageBucket: "codecraft-29e84.appspot.com", // Fixed incorrect storage bucket URL
  messagingSenderId: "655049358972",
  appId: "1:655049358972:web:d0731b4acd1aca424a13f9",
  measurementId: "G-STKW1CVXJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set authentication persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistence set to local');
  })
  .catch((error) => {
    console.error('Failed to set persistence:', error);
  });

export { app, auth, db, storage };
