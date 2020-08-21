// export section
module.exports.log = log;
module.exports.warn = warn;
module.exports.err = err;

// export functions
function log(message)   {
    internalLog(LVL_LOG, message);
}

function warn(message) {
    internalLog(LVL_WARN, message);
}

function err(message)  {
    internalLog(LVL_ERR, message);
}


// internal variables and consts
const fileSystem = require('fs')

const FILE_NAME_DEFAULT = "log.txt";

const LVL_LOG   = "INFO";
const LVL_WARN  = "WARNING";
const LVL_ERR   = "ERROR";


// internal functions
function internalLog(level, message)   {
    let fullMessage = getFullMessage(level, message);

    console.log(fullMessage);
    writeToLogFile(fullMessage);
}

function writeToLogFile(message)   {
    fStream = fileSystem.createWriteStream(getLogFileName(), {flags: 'a'});
    fStream.on("error", (e) => {
        let msg = getFullMessage(LVL_WARN, "Cannot write log to " + e.path + ".");
        console.warn(msg);
    });

    fStream.write(message + '\n');
}

function getFullMessage(level, message) {
    return fullMessage = level + "\t " + getTimeStamp() + ":\t " + message;
}

function getLogFileName()   {
    let logFileName = process.env.LOG_PATH;
    if (logFileName === undefined)  {
        logFileName = FILE_NAME_DEFAULT;
    }
    
    return logFileName;
}

function getTimeStamp() {
    return new Date().toLocaleString();
}
