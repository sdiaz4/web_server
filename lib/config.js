const path = require('path');

// Absolute path to project directory
const projectDir = path.join(__dirname, '..');

// Convert project-relative path to absolute path
function projectPath(...localPaths) {
    return path.join(projectDir, ...localPaths)
}

let logLevel = 'debug';  
if (process.env.LOG_LEVEL) {
    logLevel = process.env.LOG_LEVEL.toLowerCase();
}

// Configuration information
module.exports = {
    projectDir,

    projectPath,

    httpPort: 8000,

    logLevel
};