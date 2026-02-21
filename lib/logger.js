const winston = require('winston');

const config = require('./config.js');

// Log levels we will use
const levels = {
    silent: 0,
    error: 1,
    warn: 2,
    http: 3,
    info: 4,
    debug: 5,
    verbose: 6
};

// Colors to use when printing the different levels
const colors = {
    error: 'red',
    warn: 'yellow',
    http: 'cyan',
    info: 'green',
    debug: 'blue',
    verbose: 'grey',
};

// Format that uses full call stack as the message when an Error is logged
const traceErrors = winston.format(function traceErrors(info) {
    if (info instanceof Error) {
        info.message = info.stack;
    }
    return info;
});

// Format that converts non-string messages to JSON strings
const toJsonString = winston.format(function toJsonString(info) {
    if (typeof info.message !== 'string') {
        info.message = JSON.stringify(info.message);
    }
    return info;
});

// This is the actual logger
const logger = winston.createLogger({
    levels,
    level: config.logLevel,
    format: winston.format.combine(
        traceErrors(),
        toJsonString(),
        winston.format.cli({ levels, colors }),
    ),
    transports: new winston.transports.Console(),
});

// To connect to Morgan
logger.httpStream = {
    write(message) { logger.http(message); }
};

// Export
module.exports = logger;