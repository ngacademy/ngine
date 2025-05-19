const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { execSync } = require('child_process');

// Load the YAML configuration file
const config = yaml.load(fs.readFileSync('./.setup/configs/workspace.yaml', 'utf8'));

// Validate configuration
function validateConfig(config) {
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
}

function updateProjectJson(appName) {
  const projectJsonPath = path.join(workspaceName, 'apps', appName, 'project.json');

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

// Validate before proceeding
validateConfig(config);

// Extract project configuration
const project = config.project;

const workspaceName = "project";
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

try {
  execSync(createWorkspaceCmd, { stdio: 'inherit' });
  console.log('Workspace scaffolding complete!');

  // Update project.json with host configuration
  updateProjectJson(project.appName);
  console.log('Project configuration updated successfully!');
} catch (error) {
  console.error('Error scaffolding workspace:', error);
  process.exit(1);
}