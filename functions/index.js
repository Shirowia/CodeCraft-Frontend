/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onSchedule} = require("firebase-functions/v2/scheduler");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = getFirestore();

/**
*Fetches a dummy challenge and inserts it into Firestore.
*@return {Promise<Object|null>} The challenge object or null if an error occurs.
*/
async function fetchChallenge() {
  try {
    const challenge = {
      id: "test123",
      name: "Reverse a String",
      description: "Write a function that reverses a given string.",
      languages: ["Python", "C", "JavaScript"],
      createdAt: FieldValue.serverTimestamp(),
    };

    console.log("Dummy challenge fetched:", challenge);

    const challengeRef = db.collection("challenges").doc("daily-challenge");
    await challengeRef.set(challenge);

    console.log("Challenge inserted into Firestore ✅");
    return challenge;
  } catch (err) {
    console.error("Error inserting challenge:", err);
    return null;
  }
}

/**
 * Inserts a daily challenge into Firestore.
 * @param {Object} event - The event object.
 * @return {Promise<void>}
 */
exports.insertDailyChallenge = onSchedule("every day 00:00", async (event) => {
  console.log("Running scheduled function...");
  await fetchChallenge();
});
