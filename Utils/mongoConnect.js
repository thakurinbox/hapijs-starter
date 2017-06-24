/**
 * Created by Naresh
 */
'use strict';

//Import dependencies
let mongoose = require('mongoose');
let Config = require('../Config');
var logger = Config.logger.logger;

function createMongoUri(usr, pswd, host, port, db) {
    return `mongodb://${usr}:${pswd}@${host}:${port}/${db}`;
}

let mongoConfig = Config.dbConfig.mongo;

let MONGO_DB_URI = createMongoUri(mongoConfig.user, mongoConfig.password, mongoConfig.host, mongoConfig.port, mongoConfig.database);

mongoose.connect(MONGO_DB_URI, function (err) {
    if (err) {
        logger.error("MongoDB Connection Error: ", err);
        process.exit(1);
    } else {
        logger.info('MongoDB Connected!');
    }
});


