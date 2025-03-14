const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');

console.log('Starting dependency fix script...');

try {
  // Step 1: Clean node_modules, package-lock.json, and yarn.lock
  console.log('Cleaning existing dependency files...');
  const filesToRemove = [
    path.join(rootDir, 'node_modules'),
    path.join(rootDir, 'package-lock.json'),
    path.join(rootDir, 'yarn.lock')
  ];

  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      if (fs.lstatSync(file).isDirectory()) {
        console.log(`Removing directory: ${file}`);
        fs.rmSync(file, { recursive: true, force: true });
      } else {
        console.log(`Removing file: ${file}`);
        fs.unlinkSync(file);
      }
    }
  });

  // Step 2: Install dependencies with specific Firebase versions
  console.log('Installing dependencies...');
  execSync('npm install --legacy-peer-deps', { 
    cwd: rootDir, 
    stdio: 'inherit' 
  });

  console.log('Dependencies fixed successfully! 🎉');
} catch (error) {
  console.error('Error fixing dependencies:', error);
  process.exit(1);
}
