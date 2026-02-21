const http = require('http');
const config = require('./config.js');
const logger = require('./logger.js');
const app = require('./app/app.js');


// Create the server
const server = http.createServer(app);

// Start the server
server.listen(config.httpPort, () => {  // called once the server is running
    logger.info('Server listening on port 8000...');
});
