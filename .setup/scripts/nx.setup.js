const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { execSync } = require('child_process');
const { shouldSkipDev } = require('./common.setup.js');

// Check if we should skip dev setup first
if (shouldSkipDev()) {
  console.log('Skipping nx setup due to shouldSkipDev setting');
  process.exit(0);
}

// Get ROOT_DIR from environment variables
const ROOT_DIR = process.env.ROOT_DIR;
const configPath = path.join(ROOT_DIR, '.setup', 'configs', 'workspace.yaml');
const workspaceName = "project"; // Move to global scope

/**
 * Checks if nx.js should run
 * @returns {boolean} - True if nx.js should run, false otherwise
 */
function shouldRunNxSetup() {
  // First check if debug mode and no projects folder
  if (fs.existsSync(path.join(ROOT_DIR, '.setup/configs/debug.yaml')) && !fs.existsSync(path.join(ROOT_DIR, 'projects'))) {
    console.log('Debug mode detected and no projects folder, nx.js should run');
    return true;
  }

  // Check if nx.json exists - if it does, don't run nx.js
  if (!fs.existsSync(path.join(ROOT_DIR, 'nx.json'))) {
    console.log('No nx.json found, nx.js should run');
    return true;
  }

  // If nx.json exists, don't run nx.js
  return false;
}

// Check if nx setup should run before proceeding
if (!shouldRunNxSetup()) {
  console.log('Nx setup not needed, exiting');
  process.exit(0);
}

// Validate configuration
function loadProjectConfig() {
  console.log('Reading configuration...');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(configFile);

  if (!config.project) {
    console.error('Error: Missing project configuration in workspace.yaml');
    process.exit(1);
  }

  if (!config.project.appName) {
    console.error('Error: Missing or empty appName in workspace.yaml');
    console.error('Please set a value for project.appName before continuing');
    process.exit(1);
  }

  if (!config.project.libName) {
    console.error('Error: Missing or empty libName in workspace.yaml');
    console.error('Please set a value for project.libName before continuing');
    process.exit(1);
  }

  return config.project;
}

/**
 * Updates project.json file to add host configuration for dev containers
 */
function updateProjectJson(appName) {
  const projectJsonPath = path.join(ROOT_DIR, workspaceName, 'apps', appName, 'project.json');

  if (!fs.existsSync(projectJsonPath)) {
    console.error(`Error: Could not find project.json at ${projectJsonPath}`);
    return;
  }

  console.log(`Updating project.json at ${projectJsonPath}...`);

  // Read and parse the project.json file
  const projectJson = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));

  // Add host option to serve configuration
  if (projectJson.targets && projectJson.targets.serve) {
    projectJson.targets.serve.options = projectJson.targets.serve.options || {};
    projectJson.targets.serve.options.host = "0.0.0.0";
    console.log('Added host option to serve configuration');
  }

  // Add host option to serve-static configuration if it exists
  if (projectJson.targets && projectJson.targets['serve-static']) {
    projectJson.targets['serve-static'].options = projectJson.targets['serve-static'].options || {};
    projectJson.targets['serve-static'].options.host = "0.0.0.0";
    console.log('Added host option to serve-static configuration');
  }

  // Write the updated JSON back to the file
  fs.writeFileSync(projectJsonPath, JSON.stringify(projectJson, null, 2));
}

/**
 * Checks if the project directory exists and needs to be moved
 * @returns {boolean} - True if project directory exists and conditions allow movement
 */
function shouldMoveProject() {
  // Don't move project if in debug mode
  if (fs.existsSync(path.join(ROOT_DIR, '.setup/configs/debug.yaml'))) {
    console.log('Debug mode detected, skipping project move');
    return false;
  }

  // Don't move if nx.json already exists in root
  if (fs.existsSync(path.join(ROOT_DIR, 'nx.json'))) {
    console.log('nx.json found in root, skipping project move');
    return false;
  }

  // Only move if project directory exists
  return fs.existsSync(path.join(ROOT_DIR, workspaceName));
}

/**
 * Moves project files to root directory
 * @returns {boolean} - True if move was successful
 */
function moveProject() {
  const projectDir = path.join(ROOT_DIR, workspaceName);
  const files = fs.readdirSync(projectDir);

  for (const file of files) {
    if (file === '.git') continue;

    const srcPath = path.join(projectDir, file);
    const destPath = path.join(ROOT_DIR, file);

    if (fs.existsSync(destPath)) continue;

    fs.renameSync(srcPath, destPath);
  }

  fs.rmdirSync(projectDir, { recursive: true });
  return true;
}

/**
 * Creates the NX workspace using the provided configuration
 */
function createNxWorkspace(project) {
  // NX workspace configuration constants (remove workspaceName redeclaration)
  const preset = "angular-monorepo";
  const style = "scss";
  const bundler = "esbuild";
  const unitTestRunner = "vitest";
  const e2eTestRunner = "cypress";
  const nxCloud = "skip";
  const packageManager = "npm";

  // Build the create-nx-workspace command
  const createWorkspaceCmd = `npx --yes create-nx-workspace@latest ${workspaceName} \
    --appName=${project.appName} \
    --preset=${preset} \
    --bundler=${bundler} \
    --packageManager=${packageManager} \
    --style=${style} \
    --unitTestRunner=${unitTestRunner} \
    --e2eTestRunner=${e2eTestRunner} \
    --nxCloud=${nxCloud} \
    --routing \
    --ssr \
    --serverRouting \
    --no-interactive \
    --verbose`;

  console.log('Creating workspace with command:');
  console.log(createWorkspaceCmd);

  // Create the NX workspace
  execSync(createWorkspaceCmd, { stdio: 'inherit', cwd: ROOT_DIR });
  console.log('Workspace scaffolding complete!');
}

/**
 * Performs post-creation setup tasks
 */
function performPostSetup(project) {
  // Update project.json with host configuration
  updateProjectJson(project.appName);
  console.log('Project configuration updated successfully!');

  // Move project files if needed
  if (shouldMoveProject()) {
    console.log('Moving project files to root directory...');
    moveProject();
    console.log('Project files moved successfully');
  }
}

// ===================== MAIN ====================

try {
  console.log('Starting Nx workspace setup...');
  const projectConfig = loadProjectConfig();
  createNxWorkspace(projectConfig);
  performPostSetup(projectConfig);
  console.log('Nx workspace setup completed successfully!');
} catch (error) {
  console.error('Error during Nx workspace setup:', error);
  process.exit(1);
}