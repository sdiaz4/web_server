const mongoose = require('mongoose');
const {dbConfig} = require('./config.js');

function connect() {
    const {host, db, user, pass} = dbConfig;

    return mongoose.connect (
        `mongodb://${user}:${pass}@${host}/${db}`
    );
}

function disconnect() {
    mongoose.disconnect();
}

module.exports = { connect, disconnect };