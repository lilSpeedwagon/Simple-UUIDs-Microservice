const log = require('./log');
const http = require('http');
const express = require('express');

const port = 8080;
const app = express();


app.use((request, response, next) =>    {
    log.log("Incoming request \"" + request.url + "\".");
    next();
});

app.listen(port, (error) => {
    if (error)    {
        return log.err(error);
    }

    log.log("server is listening on port " + port + "...");
});
