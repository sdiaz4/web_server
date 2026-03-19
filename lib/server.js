const http = require('http');
const config = require('./config.js');
const logger = require('./logger.js');
const app = require('./app/app.js');
const db = require('./db.js');



// Create the server
const server = http.createServer(app);

// Start the server
async function startServer() {
    try {
        await db.connect();
        server.listen(config.httpPort, () => {  // called once the server is running
            logger.info('Server listening on port 8000...');
        });
    }
    catch (err) {
        logger.error('Failed to start server: ' + err);
        process.exit(1);
    }
}

startServer();
