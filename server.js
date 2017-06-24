/*
* Created by Naresh Thakur on 24/06/17.
*/

'use strict';

//External Dependencies
const Hapi = require('hapi');
const intert = require('inert');
const Vision = require('vision');
const handlebars = require('handlebars');

//Internal Dependencies
const Config = require('./Config');
const Routes = require('./Routes');
const Plugins = require('./Plugins');
require('./Utils/mongoConnect');

var logger = Config.logger.logger;

//Create Server
var server = new Hapi.Server({
    app: {
        name: Config.APP_CONSTANTS.SERVER.appName
    }
});

server.connection({
    port: Config.APP_CONSTANTS.SERVER.PORTS.HAPI,
    routes: {cors: true}
});

server.register(Vision, function(err){
    server.views({
        engines: {
            html: handlebars
        }
    });
});

//Register All Plugins
server.register(Plugins, function (err) {
    if (err){
        server.error('Error while loading plugins : ' + err)
    }else {
        server.log('info','Plugins Loaded');
        server.route(Routes); // Register all routes
    }
});

//Default Route
server.route(
    {
        method: 'GET',
        path: '/',
        handler: function (req, res) {
            res.view('./Views/welcome')
        }
    }
);

server.register(intert);

server.on('response', function (request) {
    logger.info("******Sending Response*******");
    logger.info(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
    logger.info('Request payload:', request.payload);
    logger.info("*******End of Response*******\n");
});

server.ext({
    type: 'onRequest',
    method: function (request, reply) {
        let clientIp = request.headers['x-forwarded-for'] || request.info.remoteAddress;
        logger.info("********Incoming Request********");
        logger.info(new Date().toLocaleTimeString(),
            clientIp + ': ' +
            request.method.toUpperCase() + ' ' +
            request.url.path);
        logger.info("***********Requset End*********\n");
        return reply.continue();
    }
});

//Start Server
server.start(function (err,data) {
    if(err){
        logger.info("Server start error",err);
    }else{
        logger.info('Server running at: ' + server.info.uri);
    }
});

