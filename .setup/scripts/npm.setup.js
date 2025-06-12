const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { shouldSkipDev } = require('./common.setup.js');

// Check if we should skip dev setup first
if (shouldSkipDev()) {
    console.log('Skipping npm setup due to shouldSkipDev setting');
    process.exit(0);
}

// Get ROOT_DIR from environment variables
const ROOT_DIR = process.env.ROOT_DIR;

// Function to check if npm install should run
function shouldRunNpmInstall() {
    const nodeModulesPath = path.join(ROOT_DIR, 'node_modules');
    const debugConfigPath = path.join(ROOT_DIR, '.setup/configs/debug.yaml');

    if (!fs.existsSync(nodeModulesPath) && !fs.existsSync(debugConfigPath)) {
        console.log("No node_modules directory and no debug mode, npm install should run");
        return true;
    }
    return false;
}

/**
 * Installs global npm packages
 */
function installGlobalPackages() {
    console.log('Installing global npm packages...');
    execSync(
        "npm install -g \
            nx \
            @nrwl/cli \
        ",
        { stdio: 'inherit' }
    );
    console.log('Global packages installed successfully');
}

/**
 * Runs local npm install if needed
 */
function runLocalNpmInstall() {
    if (shouldRunNpmInstall()) {
        console.log(`Running npm install in ${ROOT_DIR}...`);
        execSync('npm install', {
            stdio: 'inherit',
            cwd: ROOT_DIR
        });
        console.log('npm install completed successfully');
    } else {
        console.log('Skipping npm install');
    }
}

// ===================== MAIN ====================

try {
    console.log('Starting npm setup...');
    installGlobalPackages();
    runLocalNpmInstall();
    console.log('npm setup completed successfully');
} catch (error) {
    console.error('Error during npm setup:', error);
    process.exit(1);
}
