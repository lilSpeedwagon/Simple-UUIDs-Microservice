const log = require('./log');
const http = require('http');


const port = 8080;
const server = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello World!');
    response.end();
});

server.listen(port, (error) => {
    if (error)    {
        return log.err(error);
    }

    log.log("server is listening on port " + port + "...");
});

