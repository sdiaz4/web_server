//Libraries
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const sessionFileStore = require('session-file-store');
const expressHandlebars = require('express-handlebars');

const logger = require('../logger.js');
const config = require('../config.js');

const hello = require('./hello/hello.js')
const common = require('./common.js')
const secret = require('./secret/secret.js')



// Create Custom Storage Class
const FileStore = sessionFileStore(expressSession);

let app = express();

//Configure app settings for handlebars
app.engine('hbs', expressHandlebars.engine({ defaultLayout: null, extname: '.hbs' }));
app.set('views', config.projectPath('views'));

//utility middleware functions always execute
app.use(morgan(config.morganFormat, { stream: logger.httpStream }));
app.use(express.static(config.staticDir));
app.use(expressSession({
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
}));
app.use(bodyParser.urlencoded());


app.use('/hello', hello.router);
app.use('/secret.css', secret.router);
app.get('/', (req, res) => {
    res.sendFile(config.projectPath('static', "index.html"));
});

//Fallback
app.use(common.notFound);


module.exports = app;
