#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Define paths
const rootDir = process.cwd();
const projectDir = path.join(rootDir, 'project');

/**
 * Checks if the project directory exists and needs to be moved
 * @returns {boolean} - True if project directory exists
 */
function should_move_project() {
  return fs.existsSync(projectDir);
}

/**
 * Moves project files to root directory
 * @returns {boolean} - True if move was successful
 */
function move_project() {
  const files = fs.readdirSync(projectDir);

  for (const file of files) {
    if (file === '.git') continue;

    const srcPath = path.join(projectDir, file);
    const destPath = path.join(rootDir, file);

    if (fs.existsSync(destPath)) continue;

    fs.moveSync(srcPath, destPath, { overwrite: false });
  }

  fs.removeSync(projectDir);
  return true;
}

// Main execution logic
try {
  // Move project files if needed
  if (should_move_project()) {
    console.log('Moving project files to root directory...');
    move_project();
    console.log('Project files moved successfully');
  }

  console.log('Development setup completed successfully!');
} catch (error) {
  console.error('Error during setup:', error);
  process.exit(1);
}
