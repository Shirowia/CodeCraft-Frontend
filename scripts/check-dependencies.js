const fs = require('fs');
const path = require('path');

// Directory to search
const rootDir = path.resolve(__dirname, '..');

// Function to check if a file contains a specific string
function checkFileForString(filePath, searchString) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.includes(searchString);
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return false;
  }
}

// Function to walk through directories
function walkDir(dir, searchString, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    
    if (isDirectory) {
      if (f !== 'node_modules' && f !== 'build' && f !== '.git') {
        walkDir(dirPath, searchString, callback);
      }
    } else {
      // Check only JavaScript/TypeScript/JSX files
      if (dirPath.match(/\.(js|jsx|ts|tsx)$/)) {
        if (checkFileForString(dirPath, searchString)) {
          callback(dirPath);
        }
      }
    }
  });
}

console.log('Searching for files importing beautiful-skill-tree...');
walkDir(rootDir, 'beautiful-skill-tree', (filePath) => {
  console.log(`Found reference in: ${filePath}`);
});

console.log('Search complete.');
