const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const path = require('path');
const { shouldSkipInit } = require('./configs.init.js');

// =================== CONSTANTS ===================

const ROOT_DIR = process.env.ROOT_DIR;

const NODE_TARGET_VERSION = '22.15.0';
const NPM_TARGET_VERSION = '11.4.2';

const GLOBAL_PACKAGES = [
  'nx',
  '@nrwl/cli',
  'firebase-tools',
];

const NPM_NODE_MARKER = path.join(ROOT_DIR, '.init', '.npm-node');
const NPM_GLOBAL_MARKER = path.join(ROOT_DIR, '.init', '.npm-global');
const NPM_PACKAGES_MARKER = path.join(ROOT_DIR, '.init', '.npm-packages');

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
 * Checks if a particular version of node.js needs to be installed via nvm
 */
function shouldInstallNodeNvm() {
  try {
    const currentVersion = execSync('node --version', {
      encoding: 'utf8'
    }).trim().replace('v', '');

    if (currentVersion === NODE_TARGET_VERSION) {
      console.log(`[npm] ? Node.js is already at target version (${currentVersion})`);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return true;
  }
}


/**
 * Installs a particular version of node.js via nvm
 */
function installNodeNvm() {
  if (!shouldInstallNodeNvm()) {
    console.log('[npm] > Skipping node.js installation');
    return;
  }

  console.log(`[npm] > Installing node.js ${NODE_TARGET_VERSION} via nvm...`);

  try {
    const commands = [
      `nvm install ${NODE_TARGET_VERSION}`,
      `nvm alias default ${NODE_TARGET_VERSION}`,
      `nvm use ${NODE_TARGET_VERSION}`
    ];

    for (const cmd of commands) {
      execSync(`/bin/zsh -i -c "${cmd}"`, {
        stdio: 'inherit'
      });
    }

    console.log(`[npm] > Node.js ${NODE_TARGET_VERSION} installed and set as default`);
    writeFileSync(NPM_NODE_MARKER, '');
  } catch (error) {
    console.error('[npm] ! Failed to install node.js via nvm:', error);
    process.exit(1);
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

    writeFileSync(NPM_GLOBAL_MARKER, '');

  } catch (error) {
    console.error('[npm] ! Failed to update npm:', error);
    process.exit(1);
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

  writeFileSync(NPM_PACKAGES_MARKER, '');
}

// ===================== MAIN ====================

if (!shouldSkipNpmInit()) {
  try {
    console.log('[npm] - Starting npm init script ...');
    installNodeNvm();
    updateGlobalNpm();
    installGlobalPackages();
    console.log('[npm] - npm init script completed successfully');
  } catch (error) {
    console.error('[npm] ! npm init script failed:', error);
    process.exit(1);
  }
}
