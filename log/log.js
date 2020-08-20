// export section
module.exports.log = log;
module.exports.warn = warn;
module.exports.err = err;

// export functions
function log(message)   {
    internalLog("INFO", message);
}

function warn(message) {
    internalLog("WARNING", message);
}

function err(message)  {
    internalLog("ERROR", message);
}


// internal variables
const fileSystem = require('fs')
var logFileName = "log.txt";


// internal functions
function internalLog(level, message)   {
    let fullMessage = level + "\t " + getTimeStamp() + ":\t " + message + "\n";

    console.log(fullMessage);
    writeToLogFile(fullMessage);
}

function writeToLogFile(message)   {
    fStream = fileSystem.createWriteStream(getLogFileName(), {flags: 'w'});
    fStream.write(message);
}

function getLogFileName()   {
    // read from env variable LOG_PATH
    // if (logFileName == "")   {
    //         
    // }
    return logFileName;
}

function getTimeStamp() {
    return new Date().toISOString();
}
