const logger = require('../logger.js')

// Function to handle HTTP requests
function requestHandler(req, res) {
    logger.http(req.method + ': ' +  req.url)

    if (req.url == '/hello') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('Hello, world!\n');
        res.end();
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write("Not found");
        res.end();
    }
    
}

module.exports = requestHandler;
