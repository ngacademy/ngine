const fs = require('fs');
const path = require('path');

/**
 * Function to check if debug.yaml has skip-dev setting
 * @returns {boolean} - True if skip-dev is set to true, false otherwise
 */
function shouldSkipDev() {
    const rootDir = process.env.ROOT_DIR;
    const debugFile = path.join(rootDir, '.setup', 'configs', 'debug.yaml');

    if (fs.existsSync(debugFile)) {
        const content = fs.readFileSync(debugFile, 'utf8');
        return /skip-dev:\s*true/.test(content);
    }
    return false;
}

module.exports = {
    shouldSkipDev
};
