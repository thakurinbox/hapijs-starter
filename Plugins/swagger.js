'use strict';
/**
 * Created by Naresh Thakur on 24/06/17.
 */

//Register Swagger
const pack = require('../package');
const swaggerOptions = {
    pathPrefixSize: 2
};

exports.register = function(server, options, next){

    server.register({
        register: require('hapi-swagger'),
        options: swaggerOptions
    }, function (err) {
        if (err) {
            server.log(['error'], 'hapi-swagger load error: ' + err)
        }else{
            server.log(['start'], 'hapi-swagger interface loaded')
        }
    });

    next();
};

exports.register.attributes = {
    name: 'swagger-plugin'
};