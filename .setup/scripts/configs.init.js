require('./logs.init.js');
const { existsSync, readFileSync } = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const camelize = require('camelize');

// =================== CONSTANTS ===================

const DEBUG_MODE = Boolean(Number(process.env.DEBUG_MODE));
const ROOT_DIR = process.env.ROOT_DIR;

const CONFIGS_DIR = path.join(ROOT_DIR, '.setup', 'configs');

const CONFIG = camelize({
  workspace: readYamlConfig('workspace.yaml'),
  debug: readYamlConfig('debug.yaml')
});

// =================== FUNCTIONS ===================

/**
 * Helper function to read and parse YAML files
 * @param {string} filename - Name of the YAML file to read
 * @returns {object} - Parsed YAML content as JS object
 */
function readYamlConfig(filename) {
  try {
    const filePath = path.join(CONFIGS_DIR, filename);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf8');
      return yaml.load(content);
    }
  } catch (error) {
    console.error(`[configs] ! File ${filename} could not be read:`, error);
    process.exit(1);
  }
}

/**
 * Validates git configuration from workspace.yaml
 * @param {object} workspaceConfig - workspace configuration object
 */
function validateGitConfig(workspaceConfig) {
  if (!workspaceConfig || !workspaceConfig.git) {
    console.error('[configs] ! Missing git configuration object');
    process.exit(1);
  }

  const gitConfig = workspaceConfig.git;

  if (!gitConfig.user) {
    console.error('[configs] ! Missing git user configuration object');
    process.exit(1);
  }

  if (!gitConfig.user.name) {
    console.error('[configs] ! Missing git username');
    process.exit(1);
  } else if (typeof gitConfig.user.name !== 'string' || gitConfig.user.name.trim() === '') {
    console.error('[configs] ! Git username must be a non-empty string');
    process.exit(1);
  }

  if (!gitConfig.user.email) {
    console.error('[configs] ! Missing git email');
    process.exit(1);
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gitConfig.user.email)) {
    console.error(`[configs] ! Invalid git email format: "${gitConfig.user.email}"`);
    process.exit(1);
  }

  if (!gitConfig.remote) {
    console.error('[configs] ! Missing git remote URL');
    process.exit(1);
  } else if (typeof gitConfig.remote !== 'string' ||
    !gitConfig.remote.includes('git@') && !gitConfig.remote.includes('https://')
  ) {
    console.error(`[configs] ! Invalid git remote URL format: "${gitConfig.remote}"`);
    process.exit(1);
  }

  CONFIG.git = gitConfig;
}

/**
 * Validates nx configuration from workspace.yaml
 * @param {object} workspaceConfig - workspace configuration object
 */
function validateNxConfig(workspaceConfig) {
  if (!workspaceConfig || !workspaceConfig.project) {
    console.error('[configs] ! Missing nx configuration object');
    process.exit(1);
  }

  const nxConfig = workspaceConfig.project;

  if (!nxConfig.appName) {
    console.error('[configs] ! Missing nx app name');
    process.exit(1);
  } else if (typeof nxConfig.appName !== 'string' || nxConfig.appName.trim() === '') {
    console.error('[configs] ! Nx app name must be a non-empty string');
    process.exit(1);
  }

  if (!nxConfig.libName) {
    console.error('[configs] ! Missing nx lib name');
    process.exit(1);
  } else if (typeof nxConfig.libName !== 'string' || nxConfig.libName.trim() === '') {
    console.error('[configs] ! Nx lib name must be a non-empty string');
    process.exit(1);
  }

  CONFIG.nx = nxConfig;
}

// ===================== EXPORT ====================

const shouldSkipInit = Boolean(CONFIG.debug && CONFIG.debug.skipInit);
const shouldSkipGit = DEBUG_MODE;
const shouldSkipNx = false;

if (!shouldSkipGit) {
  validateGitConfig(CONFIG.workspace);
}

if (!shouldSkipNx) {
  validateNxConfig(CONFIG.workspace);
}

module.exports = {
  config: CONFIG,
  shouldSkipInit,
  shouldSkipGit,
  shouldSkipNx,
};
