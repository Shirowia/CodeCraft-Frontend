const {onSchedule} = require("firebase-functions/v2/scheduler");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = getFirestore();

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

exports.insertDailyChallenge = onSchedule("every day 00:00", async (event) => {
  console.log("Running scheduled function...");
  await fetchChallenge();
});
