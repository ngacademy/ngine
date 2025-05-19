#!/usr/bin/env node

const fs = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');
const { execSync } = require('child_process');

// Define paths (relative to root since script will be called from root)
const rootDir = process.cwd();
const configPath = path.join(rootDir, '.setup', 'configs', 'workspace.yaml');
const projectDir = path.join(rootDir, 'project');

console.log('Starting development setup...');

// Validation functions for git configuration
function validateGitConfig(config) {
  // Check if git config exists
  if (!config.git) {
    console.error('Error: Missing git configuration in workspace.yaml');
    process.exit(1);
  }
  
  // Validate user section
  if (!config.git.user) {
    console.error('Error: Missing git user configuration in workspace.yaml');
    process.exit(1);
  }
  
  // Validate name
  if (!config.git.user.name) {
    console.error('Error: Missing git username in workspace.yaml');
    console.error('Please set a value for git.user.name before continuing');
    process.exit(1);
  } else if (typeof config.git.user.name !== 'string' || config.git.user.name.trim() === '') {
    console.error('Error: Git username must be a non-empty string');
    console.error('Please set a valid value for git.user.name before continuing');
    process.exit(1);
  }
  
  // Validate email
  if (!config.git.user.email) {
    console.error('Error: Missing git email in workspace.yaml');
    console.error('Please set a value for git.user.email before continuing');
    process.exit(1);
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.git.user.email)) {
    console.error(`Error: Invalid git email format: "${config.git.user.email}"`);
    console.error('Please set a valid email address for git.user.email before continuing');
    process.exit(1);
  }
  
  // Validate remote
  if (!config.git.remote) {
    console.error('Error: Missing git remote URL in workspace.yaml');
    console.error('Please set a value for git.remote before continuing');
    process.exit(1);
  } else if (typeof config.git.remote !== 'string' || !config.git.remote.includes('git@') && !config.git.remote.includes('https://')) {
    console.error(`Error: Invalid git remote URL format: "${config.git.remote}"`);
    console.error('Remote URL should be in format git@github.com:account/repo.git or https://github.com/account/repo.git');
    process.exit(1);
  }
}

// Function to move project files to root
function moveProject(projectDir, rootDir) {
  if (!fs.existsSync(projectDir)) {
    console.warn('Project directory not found. Skipping file movement.');
    return false;
  }

  console.log('Moving project files to root directory...');
  const files = fs.readdirSync(projectDir);
  
  for (const file of files) {
    const srcPath = path.join(projectDir, file);
    const destPath = path.join(rootDir, file);
    
    // Skip if the file already exists in the destination
    if (fs.existsSync(destPath)) {
      console.log(`Skipping ${file} as it already exists in destination`);
      continue;
    }
    
    // Move the file/directory
    fs.moveSync(srcPath, destPath, { overwrite: false });
    console.log(`Moved ${file} to root directory`);
  }
  
  return true;
}

// Function to configure git settings
function configGit(config) {
  console.log('Configuring git settings...');
  
  try {
    // Configure git username if valid
    if (config.git?.user?.name && typeof config.git.user.name === 'string' && config.git.user.name.trim() !== '') {
      console.log(`Setting git username to "${config.git.user.name}"`);
      execSync(`git config user.name "${config.git.user.name}"`, { stdio: 'inherit' });
    }
    
    // Configure git email if valid
    if (config.git?.user?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.git.user.email)) {
      console.log(`Setting git email to "${config.git.user.email}"`);
      execSync(`git config user.email "${config.git.user.email}"`, { stdio: 'inherit' });
    }
    
    // Set up remote if provided and valid
    if (config.git?.remote && typeof config.git.remote === 'string' && 
        (config.git.remote.includes('git@') || config.git.remote.includes('https://'))) {
      console.log(`Adding remote origin: ${config.git.remote}`);
      
      // Check if 'origin' remote already exists and update it
      const remoteOutput = execSync('git remote').toString().trim();
      if (remoteOutput.includes('origin')) {
        console.log('Remote origin already exists, updating it...');
        execSync(`git remote set-url origin ${config.git.remote}`, { stdio: 'inherit' });
      } else {
        execSync(`git remote add origin ${config.git.remote}`, { stdio: 'inherit' });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error configuring git:', error.message);
    return false;
  }
}

// Main execution logic
try {
  console.log('Reading configuration...');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(configFile);

  // Validate git configuration
  validateGitConfig(config);

  // Move project files to root
  const moveSuccessful = moveProject(projectDir, rootDir);
  
  // Configure git after moving the files
  if (moveSuccessful) {
    const gitConfigSuccess = configGit(config);
    
    if (gitConfigSuccess) {
      console.log('Project setup completed successfully!');
    } else {
      console.warn('Project setup completed with git configuration warnings.');
    }
  } else {
    console.warn('Project directory not found. Skipping file movement and git configuration.');
  }
  
} catch (error) {
  console.error('Error during setup:', error);
  process.exit(1);
}
