const fs = require('fs');
const yaml = require('js-yaml');
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
const createWorkspaceCmd = `npx create-nx-workspace@latest ${workspaceName} \
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
  --no-interactive`;

console.log('Creating workspace with command:');
console.log(createWorkspaceCmd);

try {
  execSync(createWorkspaceCmd, { stdio: 'inherit' });
  console.log('Workspace scaffolding complete!');
} catch (error) {
  console.error('Error scaffolding workspace:', error);
  process.exit(1);
}