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
