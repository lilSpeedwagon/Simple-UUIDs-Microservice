const log       = require("./log");
const express   = require("express");
const https     = require("https");
const uuid      = require("uuid");
const fs        = require("fs");


// server consts
const STATUS_OK         = 200;
const STATUS_BAD        = 503;
const STATUS_NOT_FOUND  = 404;
const STATUS_ERROR      = 500;

const ERR_BAD_REQUEST   = "Bad request";

const PORT = 8080;

const UUID_NULL = "00000000-0000-0000-0000-000000000000";
const UUIDTypeEnum = { v3: "v3", v5: "v5" };


// metrics variables
var nUUIDv3Generated    = 0;
var nUUIDv5Generated    = 0;
var nBadResponces       = 0;
var nBadRequests        = 0;


// server instance
var app = express();
var httpsServer = getHttpsServer();

function getHttpsServer()   {
    let server = null;
    try {
        let sertificate = getSertificate();
<<<<<<< HEAD
        let pass = getPassword();
    
        const options = {
            pfx: sertificate,
            passphrase: pass
=======
        let key = getKey();
    
        const options = {
            cert: sertificate,
            key: key
>>>>>>> ec67b0a6d2d0ed7d6150b8fe3e6244659f3ae074
        };
    
        server = https.createServer(options, app);
    } catch(e)  {
        log.err("Cannot init https server: " + e + ".");
    }
<<<<<<< HEAD

    return server;
}

function getSertificate()   {
    try   {
        return fs.readFileSync("./cert.pfx")
    }   catch(e)   {
        throw("Cannot load sertificate on path " + e.path);
    }
}

function getPassword()  {
    return "password1234";
=======

    return server;
}

function getSertificate()   {
    try   {
        return fs.readFileSync("./simple-uuid-service.cert")
    }   catch(e)   {
        throw("Cannot load sertificate on path " + e.path);
    }
}

function getKey()  {
    try   {
        return fs.readFileSync("./simple-uuid-service.key")
    }   catch(e)   {
        throw("Cannot load sertificate on path " + e.path);
    }
>>>>>>> ec67b0a6d2d0ed7d6150b8fe3e6244659f3ae074
}


// start listening
if (httpsServer != null)    {
    httpsServer.listen(PORT, (error) => {
        if (error)    {
            return log.err(error);
        }
    
        log.log("Server is listening on port " + PORT + "...");
    });
}

// request preprocessing
app.use((request, response, next) =>    {
    log.log("Incoming request \"" + request.url + "\".");
    next();
});


// routing
const REQUEST_V3        = "/v3";
const REQUEST_V5        = "/v5";
const REQUEST_HEALTH    = "/health";
const REQUEST_METRICS   = "/metrics";
const REQUEST_ANY       = "*";

app.get(REQUEST_V3, (request, response, next) => {
    log.log("UUIDv3 request");
    
    let name = getRequestVariable(request, "value");

    let uuidv3 = generateUUID(name, UUIDTypeEnum.v3);
    response.send(uuidv3);
});

app.get(REQUEST_V5, (request, response, next) => {
    log.log("UUIDv5 request");

    let name = getRequestVariable(request, "value");

    let uuidv5 = generateUUID(request.query.value, UUIDTypeEnum.v5);
    response.send(uuidv5);
});

app.get(REQUEST_HEALTH, (request, response, next) => {
    log.log("Health check request.");
    sendStatus(response, getServerStatus());
});

app.get(REQUEST_METRICS, (request, response, next) => {
    log.log("Metrics request.");
    response.send(getMetrics());
});

app.get(REQUEST_ANY, (request, response, next) => {
    nBadRequests++;
    throw new Error(ERR_BAD_REQUEST);
});


// error handling
app.use((error, request, response, next) => {
    log.err(error.message);

    let status = STATUS_ERROR;
    if (error.message === ERR_BAD_REQUEST) {
        status = STATUS_NOT_FOUND;
    }

    sendStatus(response, status);
    next();
});


// server utility funcitons
function isServerOK()   {
    // There is no external connections or modules which could be in down state, so the service is always OK.
    return true;
}

function getServerStatus()  {
    let status = isServerOK() ? STATUS_OK : STATUS_BAD;
    if (status == STATUS_BAD)   {
        nBadResponces++;
    }

    return status;
}

function sendStatus(response, status)   {
    log.log("Response status: " + status + ".");
    response.sendStatus(status);
}

function getRequestVariable(request, varName)   {
    let value = request.query[varName];
    if (value === undefined) {
        value = "";
    }
    return value;
}


// internal logic of service
function generateUUID(name, type)   {
    let base = process.env.BASE_UUID;
    if (base === undefined || !uuid.validate(base)) {
        log.warn("BASE_UUID env variable is undefined or invalid. Setting base uuid as null UUID.");
        base = UUID_NULL;
    }

    let resultUUID;
    if (type === UUIDTypeEnum.v3)   {
        resultUUID = uuid.v3(name, base);
        log.log("Generated UUIDv3 is " + resultUUID + ".");
        nUUIDv3Generated++;
    }
    else if (type === UUIDTypeEnum.v5)  {
        resultUUID = uuid.v5(name, base);
        log.log("Generated UUIDv5 is " + resultUUID + ".");
        nUUIDv5Generated++;
    }
    else    {
        throw new Error("Undefined UUID type.");
    }

    return resultUUID;
}

function getMetrics()   {
    let getCounterText = (name, value, desc) =>   {
        return  "# HELP " + name + " " + desc + "\n" +
                "# TYPE " + name + " counter\n" +
                name + " " + value + " " + Date.now() + "\n\n";
    };

    let metricsText = "";

    metricsText += getCounterText("uuidv3_count", nUUIDv3Generated, "Number of generated UUIDs for v3.");
    metricsText += getCounterText("uuidv5_count", nUUIDv5Generated, "Number of generated UUIDs for v5.");
    metricsText += getCounterText("bad_responce_count", nBadResponces, "Number of 503 responses.");
    metricsText += getCounterText("bad_request_count", nBadRequests, "Number of requests to unsupported URIs (404 responses).");

    return metricsText;
}
