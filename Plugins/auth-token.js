'use strict';
/**
 * Created by Naresh Thakur on 24/06/17.
 */

const TokenManager = require('../Lib/TokenManager');

exports.register = function(server, options, next){

//Register Authorization Plugin
    server.register(require('hapi-auth-bearer-token'), function (err) {
        server.auth.strategy('UserAuth', 'bearer-access-token', {
            allowQueryToken: false,
            allowMultipleHeaders: true,
            accessTokenName: 'accessToken',
            validateFunc: function (token, callback) {
                TokenManager.verifyToken(token, function (err,response) {
                    if (err || !response || !response.userData){
                        callback(null, false, {token: token, userData: null})
                    }else {
                        callback(null, true, {token: token, userData: response.userData})
                    }
                });

            }
        });
    });

    next();
};

exports.register.attributes = {
    name: 'auth-token-plugin'
};