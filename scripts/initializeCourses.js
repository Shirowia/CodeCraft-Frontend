const { getFirestore, writeBatch, doc } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const serviceAccount = require("../scripts/codecraft-29e84-firebase-adminsdk-fbsvc-a95cfa73c9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://codecraft-29e84.firebaseio.com"
});

const db = getFirestore();

const coursesData = [
  {
    id: "data-structures-algorithms-specialization",
    name: "Data Structures and Algorithms Specialization",
    description: "Master algorithmic techniques for solving problems and become a more effective programmer.",
    overview: "This specialization is an introduction to algorithms for learners with at least a little programming experience. It covers the essential information that every serious programmer needs to know about algorithms and data structures, with emphasis on applications and scientific performance analysis of Java implementations.",
    benefits: [
      "Comprehensive understanding of fundamental data structures and algorithms",
      "Real-world problem-solving techniques",
      "Preparation for technical interviews",
      "Taught by experts from University of California San Diego"
    ],
    drawbacks: [
      "Requires basic programming knowledge as prerequisite",
      "Time commitment of approximately 6 months to complete",
      "Some mathematical concepts may be challenging"
    ],
    topics: [
      "Algorithmic toolbox and techniques",
      "Data structures fundamentals",
      "Graph algorithms",
      "String processing and pattern matching",
      "Advanced algorithms and complexity"
    ],
    url: "https://www.coursera.org/specializations/data-structures-algorithms",
    provider: "Coursera",
    difficulty: "Intermediate",
    duration: "6 months, 5-8 hours/week"
  },
  {
    id: "algorithms-part1",
    name: "Algorithms, Part I",
    description: "Learn about elementary data structures, sorting, and searching algorithms.",
    overview: "This course covers the essential information about algorithms and data structures, with emphasis on applications and scientific performance analysis of Java implementations. Part I covers elementary data structures, sorting, and searching algorithms.",
    benefits: [
      "Taught by Princeton University professors",
      "Practical implementations in Java",
      "Strong foundation in algorithm performance analysis",
      "High-quality assignments and programming challenges"
    ],
    drawbacks: [
      "Requires Java programming knowledge",
      "More theoretical than some other courses",
      "Rigorous mathematical approach may be challenging"
    ],
    topics: [
      "Union-find algorithms",
      "Analysis of algorithms",
      "Stacks and queues",
      "Elementary sorts",
      "Mergesort and Quicksort",
      "Priority queues",
      "Elementary symbol tables"
    ],
    url: "https://www.coursera.org/learn/algorithms-part1",
    provider: "Coursera",
    difficulty: "Intermediate",
    duration: "6 weeks, 6-10 hours/week"
  },
  {
    id: "algorithmic-toolbox",
    name: "Algorithmic Toolbox",
    description: "Learn algorithmic techniques for solving problems arising in computer science applications.",
    overview: "This course covers basic algorithmic techniques and ideas for computational problems arising in practical applications: greedy algorithms, binary search, sorting, dynamic programming, and many others. The course is part of a specialization but can be taken independently.",
    benefits: [
      "Practical focus on algorithm implementation",
      "Varied difficulty levels of problems",
      "Good introduction to competitive programming",
      "Step-by-step explanations of complex concepts"
    ],
    drawbacks: [
      "Some programming assignments can be quite challenging",
      "Requires basic programming knowledge",
      "May move quickly through certain concepts"
    ],
    topics: [
      "Programming challenges",
      "Algorithmic warm-up",
      "Greedy algorithms",
      "Divide and conquer",
      "Dynamic programming"
    ],
    url: "https://www.coursera.org/learn/algorithmic-toolbox",
    provider: "Coursera",
    difficulty: "Beginner to Intermediate",
    duration: "4 weeks, 4-8 hours/week"
  },
  {
    id: "learn-to-program-crafting-quality-code",
    name: "Learn to Program: Crafting Quality Code",
    description: "Learn how to write quality code that runs correctly and efficiently.",
    overview: "Learn to Program: Crafting Quality Code will give you the skills you need to write well-structured and readable code that can be used and modified by others. You'll learn about testing and documentation, as well as program design and efficiency.",
    benefits: [
      "Focus on code quality and best practices",
      "Testing and documentation emphasis",
      "Practical approach to software design",
      "Suitable for beginners with some programming experience"
    ],
    drawbacks: [
      "Uses Python specifically, may not transfer to all languages",
      "More focused on fundamentals than advanced techniques",
      "Limited coverage of large-scale software design"
    ],
    topics: [
      "Program design and development process",
      "Testing techniques and strategies",
      "Code documentation and style",
      "Code efficiency and optimization",
      "Common programming pitfalls"
    ],
    url: "https://www.coursera.org/learn/program-code",
    provider: "Coursera",
    difficulty: "Beginner",
    duration: "4 weeks, 4-6 hours/week"
  },
  {
    id: "web-development-full-stack",
    name: "Full-Stack Web Development",
    description: "Build complete web applications from front to back end.",
    overview: "This course sequence teaches you to create modern web applications with JavaScript, Node.js, React, and related technologies. You'll learn both client-side and server-side development to become a full-stack developer.",
    benefits: [
      "Comprehensive coverage of both frontend and backend",
      "Project-based learning approach",
      "Industry-relevant technology stack",
      "Builds a complete portfolio-ready application"
    ],
    drawbacks: [
      "Fast-moving technology landscape means some content may become outdated",
      "Requires significant time commitment",
      "Multiple technologies to learn may be overwhelming"
    ],
    topics: [
      "HTML, CSS, and JavaScript fundamentals",
      "React.js frontend development",
      "Node.js and Express backend development",
      "Database integration with MongoDB",
      "Authentication and deployment"
    ],
    url: "https://www.coursera.org/specializations/full-stack-react",
    provider: "Coursera",
    difficulty: "Intermediate",
    duration: "3 months, 10 hours/week"
  }
];

async function initializeCourses() {
  try {
    console.log('Starting to initialize courses data...');
    
    const batch = writeBatch(db);
    
    coursesData.forEach((course) => {
      const courseRef = doc(db, 'courses', course.id);
      batch.set(courseRef, course);
    });
    
    await batch.commit();
    console.log('Courses data successfully initialized! 🎉');
    
    // Initialize learning resources
    await initializeLearningResources();
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing courses data:', error);
    process.exit(1);
  }
}

async function initializeLearningResources() {
  try {
    console.log('Initializing learning resources...');
    
    const batch = writeBatch(db);
    
    const resources = [
      {
        name: "Understanding Algorithms and Why They Matter",
        description: "Algorithms are step-by-step procedures for solving problems and are fundamental to computer science and software development. Learning algorithms helps you write efficient code, solve complex problems, and pass technical interviews.",
        url: "https://www.khanacademy.org/computing/computer-science/algorithms"
      },
      {
        name: "Getting Started with Data Structures",
        description: "Data structures are specialized formats for organizing and storing data. Effective data structure selection can significantly impact program performance and memory usage. This guide helps beginners understand common data structures and their applications.",
        url: "https://www.geeksforgeeks.org/data-structures/"
      },
      {
        name: "Web Development Roadmap",
        description: "A comprehensive guide to becoming a web developer, covering front-end technologies like HTML, CSS, and JavaScript, as well as back-end development with various programming languages and frameworks.",
        url: "https://roadmap.sh/frontend"
      }
    ];
    
    resources.forEach((resource, index) => {
      const resourceRef = doc(db, 'learningResources', `resource-${index + 1}`);
      batch.set(resourceRef, resource);
    });
    
    await batch.commit();
    console.log('Learning resources successfully initialized! 🎉');
  } catch (error) {
    console.error('Error initializing learning resources:', error);
  }
}

initializeCourses();
