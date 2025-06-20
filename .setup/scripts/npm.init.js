const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { shouldSkipInit } = require('./config.init.js');

// =================== CONSTANTS ===================

const ROOT_DIR = process.env.ROOT_DIR;
const DEBUG_MODE = process.env.DEBUG_MODE;

switch (true) {
  case shouldSkipInit:
    console.log('[npm] Skipping npm init script due to shouldSkipInit setting');
    process.exit(0);
}

// =================== FUNCTIONS ===================

/**
 * Function to check if npm install -g should run
 */
function shouldIstallGlobalPackages() {
  try {
    execSync(`npm list -g --depth=0 nx @nrwl/cli`, { stdio: 'ignore' });
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
  if (shouldIstallGlobalPackages()) {

    console.log('[npm] Installing global npm packages...');
    execSync(
      "npm install -g \
            nx \
            @nrwl/cli \
        ",
      { stdio: 'inherit' }
    );

    console.log('[npm] Global npm packages installed successfully');
  } else {
    console.log('[npm] Skipping npm install -g');
  }
}

/**
 * Function to check if npm install should run
 */
function shouldInstallLocalPackages() {
  // TODO remove
  return false;

  const nodeModulesPath = path.join(ROOT_DIR, 'node_modules');
  const hasNodeModules = fs.existsSync(nodeModulesPath);

  switch (true) {
    case DEBUG_MODE: {
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
    console.log(`[npm] Installing local npm packages in ${ROOT_DIR}...`);
    execSync('npm install', {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    console.log('[npm] Local npm packages installed successfully');
  } else {
    console.log('[npm] Skipping npm install');
  }
}

// ===================== MAIN ====================

try {
  console.log('[npm] > Starting npm init script ...');
  installGlobalPackages();
  installLocalPackages();
  console.log('[npm] > npm init script completed successfully');
} catch (error) {
  console.error('[npm] ! Error during npm init script:', error);
  process.exit(1);
}
