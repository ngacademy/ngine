const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { join } = require('path');
const { shouldSkipInit } = require('./configs.init.js');

// =================== INIT ===================

switch (true) {
  case shouldSkipInit:
    console.log('[npm] # Skipping npm init script due to shouldSkipInit setting');
    process.exit(0);
}

// =================== CONSTANTS ===================

const ROOT_DIR = process.env.ROOT_DIR;

const GLOBAL_PACKAGES = [
  'nx',
  '@nrwl/cli'
];

// =================== FUNCTIONS ===================

/**
 * Checks if npm install -g should run
 */
function shouldInstallGlobalPackages() {
  try {
    execSync(`npm list -g --depth=0 ${GLOBAL_PACKAGES.join(' ')}`, {
      stdio: 'ignore'
    });
    console.log('[npm] ? nx already globally installed');
    return false;
  } catch {
    return true
  }
}

/**
 * Installs global npm packages if needed
 */
function installGlobalPackages() {
  if (shouldInstallGlobalPackages()) {
    console.log('[npm] > Installing global npm packages...');
    execSync(`npm install -g ${GLOBAL_PACKAGES.join(' ')}`, { stdio: 'inherit' });
    console.log('[npm] > Global npm packages installed successfully');
  } else {
    console.log('[npm] > Skipping npm install -g');
  }
}

/**
 * Checks if npm install should run
 */
function shouldInstallLocalPackages() {
  // TODO remove
  return false;

  const nodeModulesPath = join(ROOT_DIR, 'node_modules');
  const hasNodeModules = existsSync(nodeModulesPath);

  switch (true) {
    case Boolean(DEBUG_MODE): {
      console.log("[npm] ? DEBUG_MODE is true");
      return false;
    }

    case hasNodeModules: {
      console.log("[npm] ? node_modules dir already exists");
      return false;
    }

    default:
      return true;
  }
}

/**
 * Runs local npm install if needed
 */
function installLocalPackages() {
  if (shouldInstallLocalPackages()) {
    console.log(`[npm] > Installing local npm packages in ${ROOT_DIR}...`);
    execSync('npm install', {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    console.log('[npm] > Local npm packages installed successfully');
  } else {
    console.log('[npm] > Skipping npm install');
  }
}

// ===================== MAIN ====================

try {
  console.log('[npm] - Starting npm init script ...');
  installGlobalPackages();
  installLocalPackages();
  console.log('[npm] - npm init script completed successfully');
} catch (error) {
  console.error('[npm] ! npm init script failed:', error);
  process.exit(1);
}
