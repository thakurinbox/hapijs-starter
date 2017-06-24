'use strict';

let myEnv = (process.env.NODE_ENV) ? process.env.NODE_ENV.toLowerCase() : "development";

var winston = require('winston');
var fs = require('fs');
var logDir = 'log';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

let tsFormat = () => (new Date()).toLocaleTimeString();

let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: myEnv === 'development' ? 'silly' : 'info'
        }),
        new (require('winston-daily-rotate-file'))({
            filename: `${logDir}/-results.log`,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            level: myEnv === 'development' ? 'silly' : 'info'
        })
    ]
});

module.exports = {
    logger: logger
};