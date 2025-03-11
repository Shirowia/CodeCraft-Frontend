const { onSchedule } = require("firebase-functions/v2/scheduler");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });

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

// New function to fetch Coursera courses
exports.fetchCourseraCourses = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const response = await axios.get('https://api.coursera.org/api/courses.v1?q=search&query=data%20structures%20and%20algorithms&fields=name,description,primaryLanguages,photoUrl');
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching Coursera courses:', error);
      res.status(500).send('Failed to fetch Coursera courses');
    }
  });
});