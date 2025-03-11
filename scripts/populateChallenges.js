const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const serviceAccount = require("../scripts/codecraft-29e84-firebase-adminsdk-fbsvc-2ddf218297.json"); // Update with the path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<codecraft-29e84>.firebaseio.com" // Replace <project-id> with your actual project ID
});

const db = getFirestore();

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

async function populateChallenges() {
  try {
    for (const challenge of challenges) {
      challenge.createdAt = FieldValue.serverTimestamp();
      await db.collection("challenges").add(challenge);
      console.log(`Challenge ${challenge.name} added to Firestore`);
    }
    console.log("All challenges have been added to Firestore");
  } catch (error) {
    console.error("Error adding challenges to Firestore:", error);
  }
}

populateChallenges();