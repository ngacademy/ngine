const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const path = require('path');
const { shouldSkipInit } = require('./configs.init.js');

// =================== CONSTANTS ===================

const ROOT_DIR = process.env.ROOT_DIR;

const NPM_TARGET_VERSION = '11.4.2';

const GLOBAL_PACKAGES = [
  'nx',
  '@nrwl/cli',
  'firebase-tools',
  '@bitwarden/cli',
];

const NPM_GLOBAL_MARKER = path.join(ROOT_DIR, '.init', '.npm-global');

// =================== FUNCTIONS ===================

/**
 * Checks if the whole npm init script should be skipped
 */
function shouldSkipNpmInit() {
  switch (true) {
    case shouldSkipInit:
      console.log('[npm] # Skipping npm init script due to shouldSkipInit setting');
      return true;

    default:
      return false;
  }
}

/**
 * Checks if npm needs to be updated
 */
function shouldUpdateNpm() {
  try {
    const currentVersion = execSync('npm --version', {
      encoding: 'utf8'
    }).trim();

    if (currentVersion === NPM_TARGET_VERSION) {
      console.log(`[npm] ? npm is already at target version (${currentVersion})`);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return true;
  }
}

/**
 * Updates npm to the target version
 */
function updateGlobalNpm() {
  if (!shouldUpdateNpm()) {
    console.log(`[npm] > Skipping npm update`);
    return;
  }

  console.log(`[npm] > Updating npm to version ${NPM_TARGET_VERSION}...`);

  try {
    execSync(`npm install -g npm@${NPM_TARGET_VERSION}`, {
      stdio: 'inherit'
    });
    console.log('[npm] > npm updated successfully');
  } catch (error) {
    console.error('[npm] ! Failed to update npm:', error);
  }
}

/**
 * Checks if npm install -g should run
 */
function shouldInstallGlobalPackages() {
  try {
    const output = execSync(`npm list -g --depth=0 ${GLOBAL_PACKAGES.join(' ')}`, {
      encoding: 'utf8'
    });

    // Check if all packages are actually listed in the output
    const allPackagesInstalled = GLOBAL_PACKAGES.every(pkg =>
      output.includes(pkg)
    );

    if (allPackagesInstalled) {
      console.log('[npm] ? All global packages already installed');
      return false;
    } else {
      return true;
    }
  } catch {
    return true;
  }
}

/**
 * Installs global npm packages if needed
 */
function installGlobalPackages() {
  if (!shouldInstallGlobalPackages()) {
    console.log('[npm] > Skipping npm install -g');
    return;
  }

  console.log('[npm] > Installing global npm packages...');
  execSync(`npm install -g ${GLOBAL_PACKAGES.join(' ')}`, {
    stdio: 'inherit'
  });
  console.log('[npm] > Global npm packages installed successfully');

  writeFileSync(NPM_GLOBAL_MARKER, '');
}

// ===================== MAIN ====================

if (!shouldSkipNpmInit()) {
  try {
    console.log('[npm] - Starting npm init script ...');
    updateGlobalNpm();
    installGlobalPackages();
    console.log('[npm] - npm init script completed successfully');
  } catch (error) {
    console.error('[npm] ! npm init script failed:', error);
    process.exit(1);
  }
}
