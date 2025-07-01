const { existsSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const { shouldSkipGit, config } = require('./configs.init.js');

// =================== CONSTANTS ===================

const ROOT_DIR = process.env.ROOT_DIR;

const GIT_INIT_MARKER = path.join(ROOT_DIR, '.init', '.git-init');
const GIT_USER_MARKER = path.join(ROOT_DIR, '.init', '.git-user');

// =================== FUNCTIONS ===================

/**
 * Checks if the whole git init script should be skipped
 */
function shouldSkipGitInit() {
  switch (true) {
    case shouldSkipGit:
      console.log('[git] # Skipping git init script due to shouldSkipGit setting');
      return true;

    default:
      return false;
  }
}

/**
 * Checks if git should be initialized
 */
function shouldInitGit() {
  const gitDirPath = path.join(ROOT_DIR, '.git');
  const hasGitDir = existsSync(gitDirPath);

  switch (true) {
    case hasGitDir: {
      console.log("[git] ? .git directory already exists");
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
  if (!shouldInitGit()) {
    console.log('[git] > Skipping git init');
    return;
  }

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

  writeFileSync(GIT_INIT_MARKER, '');
}

/**
 * Checks if git user should be configured
 */
function shouldConfigureGitUser() {
  const hasGitUserMarker = existsSync(GIT_USER_MARKER);

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
  if (!shouldConfigureGitUser()) {
    console.log('[git] > Skipping git user configuration');
    return;
  }

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

  writeFileSync(GIT_USER_MARKER, '');
}

// ===================== MAIN ====================

if (!shouldSkipGitInit()) {
  try {
    console.log('[git] - Starting git init script ...');
    initGit();
    configureGitUser();
    console.log('[git] - git init script completed successfully');
  } catch (error) {
    console.error('[git] ! git init script failed:', error);
    process.exit(1);
  }
}
