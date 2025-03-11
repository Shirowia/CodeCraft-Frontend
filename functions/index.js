/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");

admin.initializeApp();
const db = getFirestore();

/**
 * Fetches a random challenge and inserts it into Firestore.
 * @return {Promise<Object|null>} The challenge object or null if an error occurs.
 */
async function fetchChallenge() {
  try {
    const challenges = [
      {
        id: "test123",
        name: "Reverse a String",
        description: "Write a function that reverses a given string.",
        languages: ["Python", "C", "JavaScript"],
      },
      {
        id: "test124",
        name: "Sum of Array",
        description: "Write a function that returns the sum of all elements in an array.",
        languages: ["Python", "C", "JavaScript"],
      },
      {
        id: "test125",
        name: "Palindrome Checker",
        description: "Write a function that checks if a given string is a palindrome.",
        languages: ["Python", "C", "JavaScript"],
      },
      // Add more challenges as needed
    ];

    // Randomly select a challenge
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const selectedChallenge = challenges[randomIndex];
    selectedChallenge.createdAt = FieldValue.serverTimestamp();

    console.log("Selected challenge:", selectedChallenge);

    const challengeRef = db.collection("challenges").doc("daily-challenge");
    await challengeRef.set(selectedChallenge);

    console.log("Challenge inserted into Firestore ✅");
    return selectedChallenge;
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

/**
 * Refreshes the daily challenge by calling fetchChallenge.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>}
 */
exports.refreshChallenge = onRequest(async (req, res) => {
  const challenge = await fetchChallenge();
  res.json(challenge);
});
