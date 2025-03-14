const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const serviceAccount = require("../scripts/codecraft-29e84-firebase-adminsdk-fbsvc-a95cfa73c9.json");

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

const tutorialsData = [
  {
    id: "javascript-fundamentals",
    title: "JavaScript Fundamentals",
    description: "Learn the core concepts of JavaScript programming.",
    content: [
      {
        section: "Introduction to JavaScript",
        text: "JavaScript is a programming language that enables interactive web pages. It's an essential part of web applications and can be used on both the client-side and server-side.",
        codeExample: "console.log('Hello, World!');"
      },
      {
        section: "Variables and Data Types",
        text: "JavaScript has several data types: strings, numbers, booleans, null, undefined, objects, and symbols.",
        codeExample: "let name = 'John';\nconst age = 30;\nlet isActive = true;\nconst user = { name, age };"
      },
      {
        section: "Functions",
        text: "Functions are reusable blocks of code designed to perform specific tasks.",
        codeExample: "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconst greeting = greet('John');"
      }
    ],
    difficulty: "Beginner",
    estimatedTime: "30 minutes",
    tags: ["JavaScript", "Web Development", "Programming Basics"]
  },
  {
    id: "css-flexbox",
    title: "CSS Flexbox Layout",
    description: "Master CSS Flexbox for responsive web design",
    content: [
      {
        section: "Introduction to Flexbox",
        text: "Flexbox is a one-dimensional layout method designed for laying out items in rows or columns. It makes designing flexible responsive layout structure without using float or positioning much easier.",
        codeExample: ".container {\n  display: flex;\n}"
      },
      {
        section: "Flex Direction",
        text: "The flex-direction property defines the direction items are placed in the container.",
        codeExample: ".container {\n  display: flex;\n  flex-direction: row; /* or column, row-reverse, column-reverse */\n}"
      },
      {
        section: "Alignment and Justification",
        text: "Flexbox provides several properties for aligning and justifying content.",
        codeExample: ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}"
      }
    ],
    difficulty: "Intermediate",
    estimatedTime: "45 minutes",
    tags: ["CSS", "Web Design", "Layout"]
  },
  {
    id: "python-data-structures",
    title: "Python Data Structures",
    description: "Learn about lists, dictionaries, tuples, and sets in Python",
    content: [
      {
        section: "Lists",
        text: "Lists are ordered, mutable collections that can store mixed data types.",
        codeExample: "my_list = [1, 'hello', 3.14, True]\nmy_list.append('Python')\nprint(my_list[1])  # Outputs: hello"
      },
      {
        section: "Dictionaries",
        text: "Dictionaries are unordered collections of key-value pairs.",
        codeExample: "user = {\n  'name': 'John',\n  'age': 30,\n  'is_admin': False\n}\nprint(user['name'])  # Outputs: John"
      },
      {
        section: "Tuples and Sets",
        text: "Tuples are immutable ordered collections. Sets are unordered collections of unique elements.",
        codeExample: "# Tuple\ncoordinates = (10, 20)\n\n# Set\nunique_numbers = {1, 2, 3, 1, 2}  # Will store {1, 2, 3}"
      }
    ],
    difficulty: "Beginner",
    estimatedTime: "1 hour",
    tags: ["Python", "Data Structures", "Programming"]
  }
];

async function initializeTutorials() {
  try {
    console.log('Starting to initialize tutorials data...');
    
    // In Firebase Admin SDK, we use regular batch operations
    const batch = db.batch();
    
    tutorialsData.forEach((tutorial) => {
      const tutorialRef = db.collection('tutorials').doc(tutorial.id);
      batch.set(tutorialRef, tutorial);
    });
    
    await batch.commit();
    console.log('Tutorials data successfully initialized! 🎉');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing tutorials data:', error);
    process.exit(1);
  }
}

initializeTutorials();
