/**
 * Created by Naresh on 22/06/17.
 */
var Service = require('../../Services');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var NotificationManager = require('../../Lib/NotificationManager');
var async = require('async');
var TokenManager = require('../../Lib/TokenManager');
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var Config = require('../../Config');
var md5 = require("md5");
var twilio = require("../../Utils/twilio");
var logger = Config.logger.logger;

//var mysqlConnection = require('../../Utils/mysqlConnect').mysqlConnection;

let mysqlConnection;
require('../../Utils/mysqlConnect').getMysqlCon(function(err, con){
    if(err){
        logger.error("Mysql Connection exiting due to error:", e);
        process.exit(1);
    }else{
        mysqlConnection = con;
    }
});

let userRegistration = function (payload, callback) {
    var response;
    var otp = Math.floor(Math.random() * 9000) + 1000;
    async.series([
        function (cb) {
            var criteria = {
                "countryCode" :payload.countryCode,
                "phoneNumber" :payload.phoneNumber
            };
            Service.UserService.getOnlyUser(criteria,{},{lean:true},function (err,data) {
                if(err){
                    cb(err);
                }
                else if(data){
                    cb(ERROR.PHONE_NO_EXIST);
                }
                else{
                    cb();
                }
            });
        },
        function (cb) {
            UniversalFunctions.cryptPassword(payload.password,function (err,data) {
                payload.password = data;
                cb();
            });
        },
        function (cb) {
            payload.email = (payload.email) ? payload.email.toLowerCase() : "";

            var userToAdd = {
                name: payload.name,
                photo: payload.photo,
                email : payload.email,
                country: payload.country,
                countryCode: payload.countryCode,
                phoneNumber: payload.phoneNumber,
                password: payload.password,
                otp : otp
            };
            Service.UserService.createUser(userToAdd,function (err,data) {
                if(err){
                    cb(err);
                }
                else{
                    data.password = undefined;
                    response = data.toObject();
                    cb();
                }
            });
        },
        function (cb) {
            var tokenData = { // used to generate access token and store in DB.
                id: response._id,
                type: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER,
                platform: "web"
            };
            TokenManager.setToken(tokenData, function (err, output) {
                if (err) {
                    cb(err);
                } else {
                    if (output) {
                        //response["accessToken"] = output && output.accessToken;
                        cb();
                    } else {
                        cb(ERROR.IMP_ERROR)
                    }
                }
            })
        },
        function (cb) {
            //twillio code goes here
            twilio.twilioMessage(response, cb)
        },
        function (cb) {
            //addProfilePic(response,{photoURL: payload.logo, requestId : 1},cb);
            cb();
        },
        function (cb) {
            Service.UserService.getOnlyUser({_id:response._id},{},{lean:true},function (err,data) {
                response = data;
                cb();
            });
        }
    ],function (err,data) {
        callback(err,response);
    });
};

let userLogin = function (payload, callback) {
    var userDetails;
    var successLogin = false; //To check if credentials are valid or not.
    var accessToken;

    async.auto({
        matchPhone : function (cb) {
            var criteria = { // criteria to match either username or email.
                "countryCode" :payload.countryCode,
                "phoneNumber" :payload.phoneNumber
            };

            var option = {
                lean: true
            };
            Service.UserService.getOnlyUser(criteria, {}, option, function (err, result) {
                console.log(result);
                if (err) {
                    cb(err);
                }
                else if(result){
                    userDetails = result;
                    cb();
                }
                else {
                    cb(ERROR.PHONE_NO_DOES_NOT_EXIST);
                }
            });
        },
        matchPassword : ['matchPhone',function (lastResponse, cb) {
            UniversalFunctions.decryptPassword(payload.password,userDetails.password,function (err,data) {
                if(err){
                    cb(err);
                }
                else if (!data) {
                    cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INCORRECT_PASSWORD);
                }
                else {
                    if(userDetails.isVerified){
                        successLogin = true;
                        cb();
                    }else{
                        cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.USER_NOT_VARIFIED);
                    }

                }

            });
        }],
        accessToken : ['matchPassword',function (lastResponse, cb) {
            var tokenData = { // used to generate access token and store in DB.
                id: userDetails._id,
                type: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER,
                platform: "web"
            };
            TokenManager.setToken(tokenData, function (err, output) {
                if (err) {
                    cb(err);
                } else {
                    if (output && output.accessToken) {
                        userDetails["accessToken"] = output.accessToken;
                        cb();
                    } else {
                        cb(ERROR.IMP_ERROR)
                    }
                }
            });
        }]
    },function (err,data) {
        if(err){
            callback(err);
        }
        else{
            userDetails.password = undefined;
            userDetails.__v = undefined;
            callback(null,userDetails);
        }
    });
};

let verifyEmail = function (payload,callback) {
    var userDetails = {};
    async.series([
        function (cb) {
            var criteria = {
                _id : payload.id,
                emailVerificationToken : payload.token
            };
            Service.UserService.getOnlyUser(criteria,{name:1,emailVerificationToken:1},{lean:true},function (err,user) {
                if(err){
                    cb(err);
                }
                else if(user){
                    userDetails = user;
                    cb();
                }
                else{
                    cb(ERROR.LINK_EXPIRED);
                }
            });
        },
        function (cb) {
            var criteria = {
                _id : payload.id,
                emailVerificationToken : payload.token
            };
            var setQuery = {
                $unset : {
                    emailVerificationToken : ""
                }
            };
            Service.UserService.updateUser(criteria,setQuery,{},cb);
        }
    ],function (err,data) {
        if(err){
            callback(err);
        }
        else{
            callback(null,{
                name: userDetails.name
            });
        }
    });
};

let verifyPhone = function (payload,callback) {
    var userDetails = {};
    async.series([
        function (cb) {
            var criteria = {
                "countryCode" :payload.countryCode,
                "phoneNumber" :payload.phoneNumber,
                otp : payload.otp
            };
            Service.UserService.getOnlyUser(criteria,{},{lean:true},function (err,user) {
                if(err){
                    cb(err);
                }
                else if(user){
                    userDetails = user;
                    cb();
                }
                else{
                    cb(ERROR.OTP_EXPIRED);
                }
            });
        },
        function (cb) {
            var criteria = {
                _id : userDetails._id
            };
            var setQuery = {
                $unset : {
                    otp : ""
                },
                $set : {
                    "isVerified" : true
                }
            };
            Service.UserService.updateUser(criteria,setQuery,{},cb);
        }
    ],function (err,data) {
        if(err){
            callback(err);
        }
        else{
            userDetails.password = "";
            callback(null,userDetails);
        }
    });
}

let resendOTP = function (payload,callback) {
    var userDetails;
    var otp = Math.floor(Math.random() * 9000) + 1000;

    async.series([
        function (cb) {
            var criteria = { // criteria to match either username or email.
                "countryCode" :payload.countryCode,
                "phoneNumber" :payload.phoneNumber
            };
            var option = {
                lean: true
            };

            Service.UserService.getOnlyUser(criteria, {}, option, function (err, result) {
                console.log(result);
                if (err) {
                    cb(err);
                }
                else if(result){
                    userDetails = result;
                    cb();
                }
                else {
                    cb(ERROR.PHONE_NO_DOES_NOT_EXIST);
                }
            });
        }, function (cb) {
            var criteria = {
                _id : userDetails._id
            };
            var setQuery = {
                $set : {
                    otp : otp
                }
            };
            Service.UserService.updateUser(criteria,setQuery,{},cb);
        },
        function (cb) {
            //twillio code goes here
            userDetails.otp = otp;
            twilio.twilioMessage(userDetails, cb)
        }

    ],function (err,data) {
        if(err){
            callback(err);
        }
        else{
            userDetails.password = "";
            callback(null,userDetails);
        }
    });

};

let basicDetails = function (userData, payload,callback){
    async.series([
        function (cb) {
            var criteria = {
                _id : userData._id
            };

            payload.email = (payload.email) ? payload.email.toLowerCase() : "";

            var setQuery = {
                $set : {
                    "name" : payload.name,
                    "email" : payload.email
                }
            };
            Service.UserService.updateUser(criteria,setQuery,{new:true, lean:true},function (err, data) {
                if(err){
                    cb(err);
                }else{
                    userData = data;
                    cb();
                }
            });
        }
    ],function (err,data) {
        if(err){
            callback(err);
        }
        else{
            userData.password = "";
            callback(null,userData);
        }
    });
};



module.exports = {
    userRegistration : userRegistration,
    userLogin : userLogin,
    verifyEmail: verifyEmail,
    verifyPhone: verifyPhone,
    resendOTP: resendOTP,
    basicDetails: basicDetails
};