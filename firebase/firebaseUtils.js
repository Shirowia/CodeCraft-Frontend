import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";

// Initialize Firestore
const db = getFirestore();
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

    // If displayName or photoURL is updated, also update Firebase Auth profile
    if (profileData.displayName || profileData.photoURL) {
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
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
