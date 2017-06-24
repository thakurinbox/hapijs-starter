'use strict';
/**
 * Created by Naresh Thakur on 24/06/17.
 */
const Good = require('good');

//Register Good Console

exports.register = function(server, options, next){

    let options = {
        reporters: [{
            reporter: require('good-console'),
            events: { log: ['error', 'medium'] }
        }]
    };

    server.register({
        register: Good,
        options: options
    }, function (err) {
        if (err) {
            throw err;
        }
    });

    next();
};

exports.register.attributes = {
    name: 'good-console-plugin'
};