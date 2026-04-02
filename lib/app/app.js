//Libraries
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const sessionFileStore = require('session-file-store');
const expressHandlebars = require('express-handlebars');
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const fs = require('fs');


const logger = require('../logger.js');
const config = require('../config.js');

const common = require('./common.js')
const hello = require('./hello/hello.js')
const secret = require('./secret/secret.js')
const asq = require('./asq-api/router.js');

const jwt = {
    verify: util.promisify(jsonwebtoken.verify),
};

const publicKey = fs.readFileSync(config.projectPath('keys/tas.pub.pem'));

async function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const match = authHeader && authHeader.match(/^Bearer (.+)$/);
    if (!match) {
        return res.status(401)
            .set('WWW-Authenticate', 'Bearer')  
            .json({ message: 'Authentication is required to access this resource'
            });
    }
    const token = match[1];

    try {
        const payload = await jwt.verify(token, publicKey, { issuer: 'taz.harding.edu' });
        req.user = payload;
        next();
    }  
    catch (err) {
        return res.status(401)
            .set('WWW-Authenticate', 'Bearer')
            .json({ message: 'Authentication not recognized'});
    }
}

function requireAdmin(req, res, next) {
    const roles = req.user && req.user.roles ? req.user.roles : [];
    if (!roles.includes('admin')) {
        return res.status(403).json({
            message: 'Administrator privileges are required to access this resource'
        });
    }
        next();
}


// Create Custom Storage Class
const FileStore = sessionFileStore(expressSession);

let app = express();

//Configure app settings for handlebars
app.engine('hbs', expressHandlebars.engine({ defaultLayout: null, extname: '.hbs' }));
app.set('views', config.projectPath('views'));
app.set('view engine', 'hbs');

//utility middleware functions always execute
app.use(express.json());


app.use(morgan(config.morganFormat, { stream: logger.httpStream }));
app.use('/users', authenticate);
app.use('/users/admin', requireAdmin);
app.use(express.static(config.staticDir));
app.use(expressSession({
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
}));
app.use(express.urlencoded({ extended: true }));


//middleware chain
app.get('/', (req, res) => {
    res.sendFile(config.projectPath('static', "index.html"));
});
app.use('/secret', secret.router);
app.use('/asq/api', asq.router);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        logger.warn('Invalid JSON received: ' + err.message);
        return res.status(400).json({
            code: 'INVALID_JSON',
            message: err.message
        });
    }

    next(err);
});

//Fallback
app.use(common.notFound);


module.exports = app;
