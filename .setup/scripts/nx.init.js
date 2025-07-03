const { execSync } = require('child_process');
const {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  renameSync,
  rmdirSync,
} = require('fs');
const path = require('path');
const { shouldSkipNx, config } = require('./configs.init.js');

// =================== CONSTANTS ===================

const ROOT_DIR = process.env.ROOT_DIR;
const DEBUG_MODE = Boolean(Number(process.env.DEBUG_MODE));
const DEV_FLAG = Boolean(Number(process.env.DEV_FLAG));
const WORKSPACE_NAME = "project";
const WORKSPACE_DIR = path.join(ROOT_DIR, WORKSPACE_NAME);
const HAS_WORKSPACE_DIR = existsSync(WORKSPACE_DIR) && readdirSync(WORKSPACE_DIR).length !== 0;

const NX_CREATE_MARKER = path.join(ROOT_DIR, '.init', '.nx-create');
const NX_JSON_MARKER = path.join(ROOT_DIR, '.init', '.nx-json');
const NX_MOVE_MARKER = path.join(ROOT_DIR, '.init', '.nx-move');

// =================== FUNCTIONS ===================

/**
 * Checks if the whole nx init script should be skipped
 */
function shouldSkipNxInit() {
  const nxJsonPath = path.join(ROOT_DIR, 'nx.json');
  const hasNxJson = existsSync(nxJsonPath);

  switch (true) {
    case shouldSkipNx:
      console.log('[nx] # Skipping nx init script due to shouldSkipNx setting');
      return true;
    case DEBUG_MODE && HAS_WORKSPACE_DIR:
      console.log('[nx] # Skipping nx init script in debug mode since workspace directory already exists');
      return true;
    case hasNxJson:
      console.log('[nx] # Skipping nx init script since nx.json already exists');
      return true;

    default:
      return false;
  }
}

/**
 * Checks if the NX workspace should be created
 */
function shouldCreateNxWorkspace() {
  switch (true) {
    case DEV_FLAG && HAS_WORKSPACE_DIR:
      console.log('[nx] ? dev flag detected and workspace directory already exists');
      return false;

    default:
      return true;
  }
}

/**
 * Creates the NX workspace using the provided configuration
 */
function createNxWorkspace() {
  if (!shouldCreateNxWorkspace()) {
    console.log('[nx] > Skipping NX workspace creation');
    return;
  }

  const preset = "angular-monorepo";
  const style = "scss";
  const bundler = "esbuild";
  const unitTestRunner = "vitest";
  const e2eTestRunner = "cypress";
  const nxCloud = "skip";
  const packageManager = "npm";

  const createWorkspaceCmd = `npx --yes create-nx-workspace@latest ${WORKSPACE_NAME} \
    --appName=${config.nx.appName} \
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
    --skipGit \
    --verbose`;

  console.log(`[nx] > Creating NX workspace with command: ${createWorkspaceCmd}`);
  execSync(createWorkspaceCmd, {
    stdio: 'inherit',
    cwd: ROOT_DIR
  });
  console.log('[nx] > NX workspace created successfully');

  writeFileSync(NX_CREATE_MARKER, '');
}

/**
 * Checks if the NX workspace should be created
 */
function shouldUpdateNxProjectJson() {
  switch (true) {
    case DEV_FLAG && HAS_WORKSPACE_DIR:
      console.log('[nx] ? dev flag detected and workspace directory already exists');
      return false;

    default:
      return true;
  }
}

/**
 * Updates project.json file to add host configuration for dev containers
 */
function updateNxProjectJson() {
  if (!shouldUpdateNxProjectJson()) {
    console.log('[nx] > Skipping NX project.json update');
    return;
  }

  const projectJsonPath = path.join(
    ROOT_DIR,
    WORKSPACE_NAME,
    'apps',
    config.nx.appName,
    'project.json'
  );

  if (!existsSync(projectJsonPath)) {
    console.error(`[nx] ! Could not find project.json at ${projectJsonPath}`);
    process.exit(1);
  }

  console.log(`[nx] > Updating project.json at ${projectJsonPath}...`);

  // Read and parse the project.json file
  const projectJson = JSON.parse(readFileSync(projectJsonPath, 'utf8'));

  // Add host option to serve configuration
  if (projectJson.targets && projectJson.targets.serve) {
    projectJson.targets.serve.options = projectJson.targets.serve.options || {};
    projectJson.targets.serve.options.host = "0.0.0.0";
    console.log('[nx] > Added host option to serve configuration');
  }

  // Add host option to serve-static configuration if it exists
  if (projectJson.targets && projectJson.targets['serve-static']) {
    projectJson.targets['serve-static'].options = projectJson.targets['serve-static'].options || {};
    projectJson.targets['serve-static'].options.host = "0.0.0.0";
    console.log('[nx] > Added host option to serve-static configuration');
  }

  // Write the updated JSON back to the file
  writeFileSync(projectJsonPath, JSON.stringify(projectJson, null, 2));

  writeFileSync(NX_JSON_MARKER, '');
}

/**
 * Checks if the project directory needs to be moved to root
 */
function shouldMoveNxProject() {
  switch (true) {
    case DEBUG_MODE: {
      console.log("[nx] ? debug mode detected");
      return false;
    }

    default:
      return true;
  }
}

/**
 * Moves the nx workspace to the root directory if needed
 */
function moveNxWorkspace() {
  if (shouldMoveNxProject()) {
    if (DEV_FLAG) {
      console.log('[nx] > Dev flag detected - creating symlinks with stow...');

      execSync(`stow -t .. .`, {
        stdio: 'inherit',
        cwd: WORKSPACE_DIR
      });

      console.log('[nx] > Symlinks created successfully with stow');

      execSync(`ln -s project/.gitignore .gitignore`, {
        stdio: 'inherit',
        cwd: ROOT_DIR
      });

      const gitignorePath = path.join(ROOT_DIR, '.gitignore');
      let content = readFileSync(gitignorePath, 'utf8');

      if (!content.includes('\nproject\n')) {
        content += '\nproject\n';
        writeFileSync(gitignorePath, content);
      }

      console.log('[nx] > .gitignore symlink created successfully with ln');
    } else {
      console.log('[nx] > Moving workspace files to root directory...');
      const files = readdirSync(WORKSPACE_DIR);

      for (const file of files) {
        if (file === '.git') continue;

        const srcPath = path.join(WORKSPACE_DIR, file);
        const destPath = path.join(ROOT_DIR, file);

        if (existsSync(destPath)) continue;

        renameSync(srcPath, destPath);
      }

      rmdirSync(WORKSPACE_DIR, { recursive: true });
      console.log('[nx] > Workspace files moved successfully');
    }

    writeFileSync(NX_MOVE_MARKER, '');
  } else {
    console.log('[nx] > Skipping workspace move');
  }
}

// ===================== MAIN ====================

if (!shouldSkipNxInit()) {
  try {
    console.log('[nx] - Starting nx init script ...');
    createNxWorkspace();
    updateNxProjectJson();
    moveNxWorkspace();
    console.log('[nx] - nx init script completed successfully');
  } catch (error) {
    console.error('[nx] ! nx init script failed:', error);
    process.exit(1);
  }
}
