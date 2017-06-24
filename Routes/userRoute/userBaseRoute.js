/**
 * Created by Naresh on 22/06/17.
 */
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var Controller = require('../../Controllers');
var Joi = require('joi');
var Config = require('../../Config');


var userRegistration =
    {
        method: 'POST',
        path: '/api/user/userRegistration',
        handler: function (request, reply) {
            Controller.UserBaseController.userRegistration(request.payload, function (err, user) {
                if (!err) {
                    return reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED,user));
                }
                else {
                    return reply(UniversalFunctions.sendError(err));
                }
            });
        },
        config: {
            description: 'create user',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
                    photoUrl: Joi.string().required(),
                    email: Joi.string().allow('').email().optional(),
                    country: Joi.string().required(),
                    countryCode: Joi.string().required(),
                    phoneNumber: Joi.string().min(5).required(),
                    password: Joi.string().min(6).required()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    };

var userLogin =
    {
        method: 'POST',
        path: '/api/user/userLogin',
        handler: function (request, reply) {
            Controller.UserBaseController.userLogin(request.payload, function (err, user) {
                if (!err) {
                    return reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,user));
                }
                else {
                    return reply(UniversalFunctions.sendError(err));
                }
            });
        },
        config: {
            description: 'login user',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    countryCode: Joi.string().required(),
                    phoneNumber: Joi.string().required(),
                    password: Joi.string().min(6).required()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    };


var verifyEmail =
    {
        method: 'GET',
        path: '/api/user/verifyEmail',
        handler: function (request, reply) {
            Controller.UserBaseController.verifyEmail(request.query, function (err, user) {
                if (!err) {
                    return reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,user));
                }
                else {
                    return reply(UniversalFunctions.sendError(err));
                }
            });
        },
        config: {
            description: 'verify Email',
            tags: ['api', 'user'],
            validate: {
                query: {
                    id: Joi.string().length(24).required(),
                    token: Joi.string().length(32).required()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    };

var verifyOTP =
    {
        method: 'POST',
        path: '/api/user/verifyOTP',
        handler: function (request, reply) {
            Controller.UserBaseController.verifyPhone(request.payload, function (err, user) {
                if (!err) {
                    return reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,user));
                }
                else {
                    return reply(UniversalFunctions.sendError(err));
                }
            });
        },
        config: {
            description: 'verify Email',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    countryCode: Joi.string().required(),
                    phoneNumber: Joi.string().min(5).required(),
                    otp: Joi.string().length(4).required()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    };

var resendOTP =
    {
        method: 'POST',
        path: '/api/user/resendOTP',
        handler: function (request, reply) {
            Controller.UserBaseController.resendOTP(request.payload, function (err, user) {
                if (!err) {
                    return reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,user));
                }
                else {
                    return reply(UniversalFunctions.sendError(err));
                }
            });
        },
        config: {
            description: 'verify Email',
            tags: ['api', 'user'],
            validate: {
                payload: {
                    countryCode: Joi.string().required(),
                    phoneNumber: Joi.string().min(5).required(),
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    };

var updateBasic =
    {
        method: 'POST',
        path: '/api/user/updateBasic',
        handler: function (request, reply) {

            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;

            Controller.UserBaseController.basicDetails(userData, request.payload, function (err, user) {
                if (!err) {
                    return reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,user));
                }
                else {
                    return reply(UniversalFunctions.sendError(err));
                }
            });
        },
        config: {
            description: 'Update merchant basic details',
            tags: ['api', 'user'],
            auth: 'UserAuth',
            validate: {
                headers: UniversalFunctions.authorizationHeaderObj,
                payload: {
                    name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
                    email: Joi.string().allow('').email().optional(),
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    };


var UserBaseRoute =
    [
        userRegistration,
        userLogin,
        verifyEmail,
        verifyOTP,
        resendOTP,
        updateBasic
    ];
module.exports = UserBaseRoute;