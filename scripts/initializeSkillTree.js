const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const serviceAccount = require("../scripts/codecraft-29e84-firebase-adminsdk-fbsvc-a95cfa73c9.json"); // Update with the path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://codecraft-29e84.firebaseio.com"
});

const db = getFirestore();

const skillTreeData = [
  {
    id: "programming-basics",
    title: "Programming Basics",
    description: "Learn the fundamentals of programming",
    children: ["data-structures", "algorithms"],
    dependencies: [],
    category: "Programming Basics"
  },
  {
    id: "data-structures",
    title: "Data Structures",
    description: "Understanding data structures is critical for efficient programming",
    children: ["arrays", "linked-lists", "stacks-queues", "trees", "graphs"],
    dependencies: ["programming-basics"],
    category: "Data Structures"
  },
  {
    id: "algorithms",
    title: "Algorithms",
    description: "Step-by-step procedures for solving problems",
    children: ["sorting", "searching", "dynamic-programming", "greedy-algorithms"],
    dependencies: ["programming-basics"],
    category: "Algorithms"
  },
  {
    id: "arrays",
    title: "Arrays",
    description: "Fundamental data structure for storing sequences of elements",
    children: [],
    dependencies: ["data-structures"],
    category: "Data Structures"
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    description: "Linear data structure where elements are stored in nodes",
    children: [],
    dependencies: ["data-structures"],
    category: "Data Structures"
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    description: "LIFO and FIFO data structures",
    children: [],
    dependencies: ["data-structures"],
    category: "Data Structures"
  },
  {
    id: "trees",
    title: "Trees",
    description: "Hierarchical data structures",
    children: ["binary-trees", "binary-search-trees"],
    dependencies: ["data-structures"],
    category: "Data Structures"
  },
  {
    id: "binary-trees",
    title: "Binary Trees",
    description: "Trees with at most two children per node",
    children: [],
    dependencies: ["trees"],
    category: "Data Structures"
  },
  {
    id: "binary-search-trees",
    title: "Binary Search Trees",
    description: "Ordered binary trees for fast lookup",
    children: [],
    dependencies: ["trees"],
    category: "Data Structures"
  },
  {
    id: "graphs",
    title: "Graphs",
    description: "Non-linear data structures consisting of nodes and edges",
    children: [],
    dependencies: ["data-structures"],
    category: "Data Structures"
  },
  {
    id: "sorting",
    title: "Sorting",
    description: "Methods for ordering elements",
    children: ["bubble-sort", "merge-sort", "quick-sort"],
    dependencies: ["algorithms"],
    category: "Algorithms"
  },
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    description: "Simple sorting algorithm that repeatedly steps through the list",
    children: [],
    dependencies: ["sorting"],
    category: "Algorithms"
  },
  {
    id: "merge-sort",
    title: "Merge Sort",
    description: "Efficient, stable, divide and conquer sorting algorithm",
    children: [],
    dependencies: ["sorting"],
    category: "Algorithms"
  },
  {
    id: "quick-sort",
    title: "Quick Sort",
    description: "Fast, divide and conquer sorting algorithm",
    children: [],
    dependencies: ["sorting"],
    category: "Algorithms"
  },
  {
    id: "searching",
    title: "Searching",
    description: "Methods for finding elements",
    children: ["linear-search", "binary-search"],
    dependencies: ["algorithms"],
    category: "Algorithms"
  },
  {
    id: "linear-search",
    title: "Linear Search",
    description: "Simple search checking each element sequentially",
    children: [],
    dependencies: ["searching"],
    category: "Algorithms"
  },
  {
    id: "binary-search",
    title: "Binary Search",
    description: "Faster search algorithm for sorted arrays",
    children: [],
    dependencies: ["searching"],
    category: "Algorithms"
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    description: "Method for solving complex problems by breaking them down",
    children: [],
    dependencies: ["algorithms"],
    category: "Algorithms"
  },
  {
    id: "greedy-algorithms",
    title: "Greedy Algorithms",
    description: "Algorithms that make locally optimal choices",
    children: [],
    dependencies: ["algorithms"],
    category: "Algorithms"
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Learn to build web applications",
    children: ["frontend", "backend"],
    dependencies: [],
    category: "Web Development"
  },
  {
    id: "frontend",
    title: "Frontend",
    description: "Client-side web development",
    children: ["html-css", "javascript", "frontend-frameworks"],
    dependencies: ["web-development"],
    category: "Web Development"
  },
  {
    id: "html-css",
    title: "HTML & CSS",
    description: "Structure and styling for web pages",
    children: [],
    dependencies: ["frontend"],
    category: "Web Development"
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Programming language of the web",
    children: ["dom-manipulation", "es6-features"],
    dependencies: ["frontend"],
    category: "Web Development"
  },
  {
    id: "dom-manipulation",
    title: "DOM Manipulation",
    description: "Modifying the Document Object Model",
    children: [],
    dependencies: ["javascript"],
    category: "Web Development"
  },
  {
    id: "es6-features",
    title: "ES6+ Features",
    description: "Modern JavaScript syntax and features",
    children: [],
    dependencies: ["javascript"],
    category: "Web Development"
  },
  {
    id: "frontend-frameworks",
    title: "Frontend Frameworks",
    description: "Libraries for building user interfaces",
    children: ["react", "vue", "angular"],
    dependencies: ["javascript"],
    category: "Web Development"
  },
  {
    id: "react",
    title: "React",
    description: "JavaScript library for building user interfaces",
    children: [],
    dependencies: ["frontend-frameworks"],
    category: "Web Development"
  },
  {
    id: "vue",
    title: "Vue.js",
    description: "Progressive JavaScript framework",
    children: [],
    dependencies: ["frontend-frameworks"],
    category: "Web Development"
  },
  {
    id: "angular",
    title: "Angular",
    description: "Platform for building mobile and desktop web applications",
    children: [],
    dependencies: ["frontend-frameworks"],
    category: "Web Development"
  },
  {
    id: "backend",
    title: "Backend",
    description: "Server-side web development",
    children: ["nodejs", "express", "databases"],
    dependencies: ["web-development"],
    category: "Web Development"
  },
  {
    id: "nodejs",
    title: "Node.js",
    description: "JavaScript runtime for server-side programming",
    children: [],
    dependencies: ["backend"],
    category: "Web Development"
  },
  {
    id: "express",
    title: "Express.js",
    description: "Web application framework for Node.js",
    children: [],
    dependencies: ["backend", "nodejs"],
    category: "Web Development"
  },
  {
    id: "databases",
    title: "Databases",
    description: "Storing and retrieving data",
    children: ["sql", "nosql"],
    dependencies: ["backend"],
    category: "Web Development"
  },
  {
    id: "sql",
    title: "SQL",
    description: "Structured Query Language for relational databases",
    children: [],
    dependencies: ["databases"],
    category: "Web Development"
  },
  {
    id: "nosql",
    title: "NoSQL",
    description: "Non-relational databases like MongoDB",
    children: [],
    dependencies: ["databases"],
    category: "Web Development"
  }
];

async function initializeSkillTree() {
  try {
    console.log('Starting to initialize skill tree data...');
    
    // Check if collection already has data
    const snapshot = await db.collection('skillTree').get();
    if (!snapshot.empty) {
      console.log('Skill tree data already exists. Clearing existing data...');
      // Delete existing documents if needed
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }
    
    // Add new data in batches
    const batchSize = 20;
    for (let i = 0; i < skillTreeData.length; i += batchSize) {
      const batch = db.batch();
      const chunk = skillTreeData.slice(i, i + batchSize);
      
      chunk.forEach(skill => {
        const ref = db.collection('skillTree').doc(skill.id);
        batch.set(ref, skill);
      });
      
      await batch.commit();
      console.log(`Batch ${Math.ceil((i + 1) / batchSize)} of ${Math.ceil(skillTreeData.length / batchSize)} completed.`);
    }
    
    console.log('Skill tree data successfully initialized! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing skill tree data:', error);
    process.exit(1);
  }
}

initializeSkillTree();
