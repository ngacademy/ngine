const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml'); // You may need to install this dependency
const camelize = require('camelize');

const rootDir = process.env.ROOT_DIR;
const configsDir = path.join(rootDir, '.setup', 'configs');

/**
 * Helper function to read and parse YAML files
 * @param {string} filename - Name of the YAML file to read
 * @returns {object} - Parsed YAML content as JS object
 */
function readYamlConfig(filename) {
  try {
    const filePath = path.join(configsDir, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return yaml.load(content);
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
  }
  return null;
}

const config = camelize({
  workspace: readYamlConfig('workspace.yaml'),
  debug: readYamlConfig('debug.yaml')
});

const shouldSkipInit = Boolean(config.debug && config.debug.skipDev);

module.exports = {
  config,
  shouldSkipInit
};
