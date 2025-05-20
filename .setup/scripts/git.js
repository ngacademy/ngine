#!/usr/bin/env node

const fs = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');
const { execSync } = require('child_process');


// Define paths (relative to root since script will be called from root)
const rootDir = process.cwd();
const configPath = path.join(rootDir, '.setup', 'configs', 'workspace.yaml');
const gitDir = path.join(rootDir, '.git');
const gitkeepPath = path.join(rootDir, 'tmp', '.gitkeep');

console.log('Starting git configuration setup...');

/**
 * Checks if git initialization should occur based on existence of .git directory
 * @returns {boolean} - True if git should be initialized, false otherwise
 */
function should_init_git() {
  return !fs.existsSync(gitDir);
}

/**
 * Checks if remote update should occur based on the presence of a special .gitkeep file
 * @returns {boolean} - False if .gitkeep exists, true otherwise
 */
function should_update_remote() {
  console.log('Checking if ./temp/.gitkeep exists...');
  return fs.existsSync(gitkeepPath);
}

// Main execution logic
try {
  console.log('Reading configuration...');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(configFile);

  // Check if git config exists - validate only once at the start
  if (!config.git) {
    console.error('Error: Missing git configuration in workspace.yaml');
    process.exit(1);
  }

  // Initialize git repository if needed
  if (should_init_git()) {
    console.log('Initializing git repository...');
    execSync('git init -b main', { stdio: 'inherit' });
  } else {
    console.log('.git directory already exists in root directory');
  }

  // Validate user section before using any user properties
  if (!config.git.user) {
    console.error('Error: Missing git user configuration in workspace.yaml');
    process.exit(1);
  }

  // Validate and set username
  if (!config.git.user.name) {
    console.error('Error: Missing git username in workspace.yaml');
    console.error('Please set a value for git.user.name before continuing');
    process.exit(1);
  } else if (typeof config.git.user.name !== 'string' || config.git.user.name.trim() === '') {
    console.error('Error: Git username must be a non-empty string');
    console.error('Please set a valid value for git.user.name before continuing');
    process.exit(1);
  } else {
    console.log(`Setting git username to "${config.git.user.name}"`);
    execSync(`git config user.name "${config.git.user.name}"`, { stdio: 'inherit' });
  }

  // Validate and set email
  if (!config.git.user.email) {
    console.error('Error: Missing git email in workspace.yaml');
    console.error('Please set a value for git.user.email before continuing');
    process.exit(1);
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.git.user.email)) {
    console.error(`Error: Invalid git email format: "${config.git.user.email}"`);
    console.error('Please set a valid email address for git.user.email before continuing');
    process.exit(1);
  } else {
    console.log(`Setting git email to "${config.git.user.email}"`);
    execSync(`git config user.email "${config.git.user.email}"`, { stdio: 'inherit' });
  }

  // Validate and set remote only if needed
  if (should_update_remote()) {
    // Only validate remote if we need to update it
    if (!config.git.remote) {
      console.error('Error: Missing git remote URL in workspace.yaml');
      console.error('Please set a value for git.remote before continuing');
      process.exit(1);
    } else if (typeof config.git.remote !== 'string' || !config.git.remote.includes('git@') && !config.git.remote.includes('https://')) {
      console.error(`Error: Invalid git remote URL format: "${config.git.remote}"`);
      console.error('Remote URL should be in format git@github.com:account/repo.git or https://github.com/account/repo.git');
      process.exit(1);
    }

    // Remote is validated, now set it up
    console.log(`Adding remote origin: ${config.git.remote}`);

    // Check if 'origin' remote already exists and update it
    const remoteOutput = execSync('git remote').toString().trim();
    if (remoteOutput.includes('origin')) {
      console.log('tmp/.gitkeep not found, updating remote origin...');
      execSync(`git remote set-url origin ${config.git.remote}`, { stdio: 'inherit' });
    } else {
      execSync(`git remote add origin ${config.git.remote}`, { stdio: 'inherit' });
    }
  } else {
    console.log('no tmp/.gitkeep found, skipping remote update.');
  }
} catch (error) {
  console.error('Error during git setup:', error);
  process.exit(1);
}
