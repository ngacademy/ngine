const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { execSync } = require('child_process');
const { shouldSkipGit, config } = require('./configs.init.js');

// =================== INIT ===================

switch (true) {
  case shouldSkipGit:
    console.log('[git] # Skipping git init script due to shouldSkipGit setting');
    process.exit(0);
}

// =================== CONSTANTS ===================

const ROOT_DIR = process.env.ROOT_DIR;
const GIT_INIT_MARKER = path.join(ROOT_DIR, '.init', '.git-init');
const GIT_USER_MARKER = path.join(ROOT_DIR, '.init', '.git-user');

// =================== FUNCTIONS ===================

/**
 * Checks if git should be initialized
 */
function shouldInitGit() {
  const gitDirPath = path.join(ROOT_DIR, '.git');
  const hasGitDir = existsSync(gitDirPath);

  const hasGitInitMarker = fs.existsSync(GIT_INIT_MARKER);

  switch (true) {
    case hasGitDir && hasGitInitMarker: {
      console.log("[git] ? .git directory and .git-init marker already exist");
      return false;
    }

    default:
      return true;
  }
}

/**
 * Initializes git repository if needed
 * includes git init and git remote setup
 */
function initGit() {
  if (shouldInitGit()) {
    console.log(`[git] > Initializing git repository in ${ROOT_DIR}...`);

    execSync('git init -b main', {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    console.log('[git] > Git repository initialized successfully');

    console.log(`[git] > Initializing git remote in ${ROOT_DIR}...`);
    execSync(`git remote add origin ${config.git.remote}`, {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    console.log(`[git] > Git remote origin set to ${config.git.remote}`);

    fs.writeFileSync(GIT_INIT_MARKER, '');
  } else {
    console.log('[git] > Skipping git init');
  }
}

/**
 * Checks if git user should be configured
 */
function shouldConfigureGitUser() {
  const hasGitUserMarker = fs.existsSync(GIT_USER_MARKER);

  switch (true) {
    case hasGitUserMarker: {
      console.log("[git] ? .git-user marker already exists");
      return false;
    }

    default:
      return true;
  }
}

/**
 * Configures git user name and email if needed
 */
function configureGitUser() {
  if (shouldConfigureGitUser()) {
    console.log(`[git] > Configuring git user in ${ROOT_DIR}...`);

    execSync(`git config user.name "${config.git.user.name}"`, {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    console.log(`[git] > Git user name set to "${config.git.user.name}"`);

    execSync(`git config user.email "${config.git.user.email}"`, {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    console.log(`[git] > Git user email set to "${config.git.user.email}"`);

    fs.writeFileSync(GIT_USER_MARKER, '');
  } else {
    console.log('[git] > Skipping git init');
  }
}

// ===================== MAIN ====================

try {
  console.log('[git] - Starting git init script ...');
  initGit();
  configureGitUser();
  console.log('[git] - git init script completed successfully');
} catch (error) {
  console.error('[git] ! git init script failed:', error);
  process.exit(1);
}
