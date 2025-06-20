const fs = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');
const { execSync } = require('child_process');
const { shouldSkipDev } = require('./config.init.js');

// Check if we should skip dev setup first
if (shouldSkipDev()) {
  console.log('Skipping git setup due to shouldSkipDev setting');
  process.exit(0);
}

// Get ROOT_DIR from environment variables
const ROOT_DIR = process.env.ROOT_DIR;

/**
 * Checks if git.js should run
 * @returns {boolean} - True if git.js should run, false otherwise
 */
function shouldRunGitSetup() {
  const gitIgnorePath = path.join(ROOT_DIR, 'tmp', '.gitignore');

  if (fs.existsSync(gitIgnorePath)) {
    console.log('Git repository already initialized, skipping git.js');
    return false;
  }

  return true;
}

// Check if git setup should run
if (!shouldRunGitSetup()) {
  process.exit(0);
}

// Define paths (relative to ROOT_DIR)
const configPath = path.join(ROOT_DIR, '.setup', 'configs', 'workspace.yaml');
const gitDir = path.join(ROOT_DIR, '.git');
const gitkeepPath = path.join(ROOT_DIR, 'tmp', '.gitkeep');

/**
 * Validates and loads git configuration
 * @returns {Object} - Git configuration object
 */
function loadGitConfig() {
  console.log('Reading configuration...');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(configFile);

  if (!config.git) {
    console.error('Error: Missing git configuration in workspace.yaml');
    process.exit(1);
  }

  return config.git;
}

/**
 * Initializes git repository if needed
 */
function setupGitRepository() {
  if (shouldInitGit()) {
    console.log('Initializing git repository...');
    execSync('git init -b main', { stdio: 'inherit', cwd: ROOT_DIR });
  } else {
    console.log('.git directory already exists in root directory');
  }
}

/**
 * Configures git user name and email
 * @param {Object} gitConfig - Git configuration object
 */
function configureGitUser(gitConfig) {
  if (!gitConfig.user) {
    console.error('Error: Missing git user configuration in workspace.yaml');
    process.exit(1);
  }

  if (!gitConfig.user.name) {
    console.error('Error: Missing git username in workspace.yaml');
    console.error('Please set a value for git.user.name before continuing');
    process.exit(1);
  } else if (typeof gitConfig.user.name !== 'string' || gitConfig.user.name.trim() === '') {
    console.error('Error: Git username must be a non-empty string');
    console.error('Please set a valid value for git.user.name before continuing');
    process.exit(1);
  } else {
    console.log(`Setting git username to "${gitConfig.user.name}"`);
    execSync(`git config user.name "${gitConfig.user.name}"`, { stdio: 'inherit', cwd: ROOT_DIR });
  }

  if (!gitConfig.user.email) {
    console.error('Error: Missing git email in workspace.yaml');
    console.error('Please set a value for git.user.email before continuing');
    process.exit(1);
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gitConfig.user.email)) {
    console.error(`Error: Invalid git email format: "${gitConfig.user.email}"`);
    console.error('Please set a valid email address for git.user.email before continuing');
    process.exit(1);
  } else {
    console.log(`Setting git email to "${gitConfig.user.email}"`);
    execSync(`git config user.email "${gitConfig.user.email}"`, { stdio: 'inherit', cwd: ROOT_DIR });
  }
}

/**
 * Configures git remote if needed
 * @param {Object} gitConfig - Git configuration object
 */
function configureGitRemote(gitConfig) {
  if (!shouldUpdateRemote()) {
    console.log('tmp/.gitkeep not found, skipping remote update.');
    return;
  }

  if (!gitConfig.remote) {
    console.error('Error: Missing git remote URL in workspace.yaml');
    console.error('Please set a value for git.remote before continuing');
    process.exit(1);
  } else if (typeof gitConfig.remote !== 'string' || !gitConfig.remote.includes('git@') && !gitConfig.remote.includes('https://')) {
    console.error(`Error: Invalid git remote URL format: "${gitConfig.remote}"`);
    console.error('Remote URL should be in format git@github.com:account/repo.git or https://github.com/account/repo.git');
    process.exit(1);
  }

  console.log(`Adding remote origin: ${gitConfig.remote}`);

  const remoteOutput = execSync('git remote', { cwd: ROOT_DIR }).toString().trim();
  if (remoteOutput.includes('origin')) {
    console.log('Updating existing remote origin...');
    execSync(`git remote set-url origin ${gitConfig.remote}`, { stdio: 'inherit', cwd: ROOT_DIR });
  } else {
    execSync(`git remote add origin ${gitConfig.remote}`, { stdio: 'inherit', cwd: ROOT_DIR });
  }
}

/**
 * Checks if git initialization should occur based on existence of .git directory
 * @returns {boolean} - True if git should be initialized, false otherwise
 */
function shouldInitGit() {
  return !fs.existsSync(gitDir);
}

/**
 * Checks if remote update should occur based on the presence of a special .gitkeep file
 * @returns {boolean} - True if .gitkeep exists, false otherwise
 */
function shouldUpdateRemote() {
  console.log('Checking if ./tmp/.gitkeep exists...');
  return fs.existsSync(gitkeepPath);
}

/**
 * Creates tmp/.gitignore file to mark git setup completion
 */
function createGitSetupMarker() {
  const tmpDir = path.join(ROOT_DIR, 'tmp');
  const gitignorePath = path.join(tmpDir, '.gitignore');

  fs.ensureDirSync(tmpDir);
  fs.writeFileSync(gitignorePath, '');
  console.log('Created tmp/.gitignore to mark git setup completion');
}

// ===================== MAIN ====================

try {
  console.log('Starting git configuration setup...');
  const gitConfig = loadGitConfig();
  setupGitRepository();
  configureGitUser(gitConfig);
  configureGitRemote(gitConfig);
  createGitSetupMarker();
  console.log('Git configuration setup completed successfully');
} catch (error) {
  console.error('Error during git setup:', error);
  process.exit(1);
}
