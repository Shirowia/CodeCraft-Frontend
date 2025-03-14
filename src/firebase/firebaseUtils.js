import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { db } from './firebase';

const auth = getAuth();

/**
 * Updates user profile in Firestore
 * @param {string} userId - The user's UID
 * @param {Object} profileData - User profile fields to update
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, profileData, { merge: true });

    // Ensure auth.currentUser is available before updating Firebase Auth profile
    if (auth.currentUser && (profileData.displayName || profileData.photoURL)) {
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName || "",
        photoURL: profileData.photoURL || "",
      });
    }

    console.log("User profile updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

/**
 * Fetches user data from Firestore
 * @param {string} userId - The user's UID
 * @returns {Object|null} - User data or null if not found
 */
export const getUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No such user found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

/**
 * Saves user skill tree progress to Firestore
 * @param {string} userId - The user's UID
 * @param {Object} progressData - Skill tree progress data
 * @returns {Promise<boolean>} - Success status
 */
export const saveSkillProgress = async (userId, progressData) => {
  try {
    const progressRef = doc(db, "skillProgress", userId);
    await setDoc(progressRef, {
      progress: progressData,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log("Skill progress saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving skill progress:", error);
    return false;
  }
};

/**
 * Fetches user skill tree progress from Firestore
 * @param {string} userId - The user's UID
 * @returns {Object|null} - Skill progress data or null if not found
 */
export const getSkillProgress = async (userId) => {
  try {
    const progressRef = doc(db, "skillProgress", userId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists() && progressSnap.data().progress) {
      return progressSnap.data().progress;
    } else {
      console.log("No skill progress found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching skill progress:", error);
    return null;
  }
};
