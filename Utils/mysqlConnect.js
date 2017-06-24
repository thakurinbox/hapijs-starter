let async = require("async");
var Config  = require('../Config');
var mysql   = require('mysql');
var logger  = Config.logger.logger;
var mysqlConnection;


let retries = 0;
let maxRetries = 3;
let orignalCbWasCalled = false;
var mysqlCon;

let handleMysqlConnection = function(calback) {

    mysqlConnection = mysql.createConnection({
        host     : Config.dbConfig.mysql.host,
        user     : Config.dbConfig.mysql.user,
        password : Config.dbConfig.mysql.password,
        database : Config.dbConfig.mysql.database
    });

    mysqlConnection.connect(function(err) {
        if(err) {
            logger.error('error when connecting to   mysql db:', err);
            setTimeout(function () {
                retries = retries + 1;
                logger.info("Retry Count while connecting to mysql:", retries);
                if (retries > maxRetries) {
                    if (!orignalCbWasCalled) {
                        orignalCbWasCalled = true;
                        return calback(err);
                    } else {
                        throw err;
                    }
                } else {
                    if (!orignalCbWasCalled) {
                        handleMysqlConnection(calback);
                    } else {
                        handleMysqlConnection(function () {
                            return;
                        });
                    }

                }
            }, 2000);
        }else{
            logger.info("Connected to MySQL");
            orignalCbWasCalled = true;
            return calback(null);
        }
    });

    mysqlConnection.on('error', function(err) {
        logger.error('Mysql db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleMysqlConnection(function (err) {
                if (err) {
                    logger.error('Error when reconnecting to db: ', err);
                } else {
                    logger.info('Re-Connected to MySQL!');
                }
                return;
            });
        } else {
            throw err;
        }
    });
};
const keepDBConnectionAlive = function () {
    mysqlConnection.query('SELECT 1',
        function (err, rows) {
            if (err) {
                logger.error('ERROR in query SELECT 1', err);
            } else {
                logger.info(rows);
            }
        });
};

module.exports = {
    getMysqlCon: function (callback) {
        async.series([
            function (cb) {
                handleMysqlConnection(function (err, data) {
                    if(err){
                        cb(err);
                    }else{
                        cb();
                    }
                });
            },
            function (cb) {
                setInterval(function () {
                    keepDBConnectionAlive();
                }, 60000);
                mysqlCon = mysqlConnection;
                cb();
            }
        ],
        function (e, d) {
            if (e) {
                logger.error("Mysql Connection exiting due to error:", e);
                process.exit(1);
            }
            return callback(null, mysqlCon);
        });
    }
};

exports.mysqlConnection = mysqlConnection;


