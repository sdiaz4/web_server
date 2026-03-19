const mongoose = require('mongoose');
const {dbConfig} = require('./config.js');

function connect() {
    const {host, db, pass, user} = dbConfig;

   return mongoose.connect (
        `mongodb://${host}/${db}`,
        { user, pass }
    );
}

function disconnect() {
    mongoose.disconnect();
}

module.exports = { connect, disconnect };