const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const serviceAccount = require("../scripts/codecraft-29e84-firebase-adminsdk-fbsvc-a95cfa73c9.json"); // Update with the path to your service account key

// Check if Firebase app is already initialized to avoid multiple initializations
let db;
try {
  db = getFirestore(admin.app());
} catch (error) {
  // If not initialized, initialize with service account
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://codecraft-29e84.firebaseio.com"
  });
  
  db = getFirestore();
}

const challenges = [
  {
    id: "reverse-string",
    name: "Reverse a String",
    description: "Write a function that reverses a given string. For example, 'hello' should become 'olleh'.",
    languages: ["Python", "C", "JavaScript"],
    difficulty: "Easy",
    example: "Input: 'hello'\nOutput: 'olleh'",
    hint: "Consider using built-in string manipulation methods or iterate through the string backwards.",
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    id: "sum-array",
    name: "Sum of Array",
    description: "Write a function that returns the sum of all elements in an array. For example, [1, 2, 3, 4] should return 10.",
    languages: ["Python", "C", "JavaScript"],
    difficulty: "Easy",
    example: "Input: [1, 2, 3, 4]\nOutput: 10",
    hint: "Consider using a loop or a built-in method to calculate the sum.",
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    id: "palindrome",
    name: "Palindrome Checker",
    description: "Write a function that checks if a string is a palindrome (reads the same forward and backward, ignoring case, spaces, and punctuation). For example, 'A man, a plan, a canal: Panama' should return true.",
    languages: ["Python", "C", "JavaScript"],
    difficulty: "Medium",
    example: "Input: 'racecar'\nOutput: true\n\nInput: 'hello'\nOutput: false",
    hint: "You may want to normalize the string by removing non-alphanumeric characters and converting to lowercase before checking.",
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    id: "fizz-buzz",
    name: "FizzBuzz",
    description: "Write a function that prints numbers from 1 to n. For multiples of 3, print 'Fizz' instead. For multiples of 5, print 'Buzz' instead. For numbers that are multiples of both 3 and 5, print 'FizzBuzz'.",
    languages: ["Python", "C", "JavaScript"],
    difficulty: "Easy",
    example: "Input: 15\nOutput: [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz']",
    hint: "Use the modulo operator (%) to check if a number is divisible by 3 and/or 5.",
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    id: "anagram-checker",
    name: "Anagram Checker",
    description: "Write a function that determines if two strings are anagrams of each other (contain the same letters in different orders).",
    languages: ["Python", "C", "JavaScript"],
    difficulty: "Medium",
    example: "Input: 'listen', 'silent'\nOutput: true\n\nInput: 'hello', 'world'\nOutput: false",
    hint: "Consider sorting the characters of both strings or using a character frequency counter.",
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    id: "two-sum",
    name: "Two Sum",
    description: "Given an array of integers and a target sum, find the indices of two numbers that add up to the target sum.",
    languages: ["Python", "C", "JavaScript"],
    difficulty: "Medium",
    example: "Input: [2, 7, 11, 15], target = 9\nOutput: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)",
    hint: "Consider using a hash map to store values and their indices as you iterate through the array.",
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    id: "longest-substring",
    name: "Longest Substring Without Repeating Characters",
    description: "Given a string, find the length of the longest substring without repeating characters.",
    languages: ["Python", "C", "JavaScript"],
    difficulty: "Hard",
    example: "Input: 'abcabcbb'\nOutput: 3 (The longest substring is 'abc')\n\nInput: 'bbbbb'\nOutput: 1 (The longest substring is 'b')",
    hint: "Use a sliding window approach with two pointers and a set to track characters in the current window.",
    createdAt: admin.firestore.Timestamp.now()
  }
];

async function populateChallenges() {
  try {
    console.log('Starting to populate challenges...');
    
    const batch = db.batch();
    
    challenges.forEach((challenge) => {
      const challengeRef = db.collection('challenges').doc(challenge.id);
      batch.set(challengeRef, challenge);
    });
    
    await batch.commit();
    console.log('Challenges successfully populated! 🎉');
    
    process.exit(0);
  } catch (error) {
    console.error('Error populating challenges:', error);
    process.exit(1);
  }
}

populateChallenges();