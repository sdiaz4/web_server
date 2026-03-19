const { Session } = require('inspector');
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

const staticDir = projectPath('static');

let morganFormat = 'dev';
if (process.env.MORGAN_FORMAT) {
    morganFormat = process.env.MORGAN_FORMAT;
}

// Database credentials
const dbConfig = {
    host: "localhost",
    db: "asq",
    user: "",
    pass: ""
};


// Configuration information
module.exports = {
    projectDir,

    projectPath,

    httpPort: 8000,

    logLevel,

    staticDir,

    morganFormat,

    sessionSecret: process.env.SESSION_SECRET || 'default_secret',

    dbConfig
};