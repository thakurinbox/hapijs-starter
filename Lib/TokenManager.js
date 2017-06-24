'use strict';
/**
 * Created by Naresh Thakur on 24/06/17.
 */
const Config = require('../Config');
const Jwt = require('jsonwebtoken');
const async = require('async');
const Service = require('../Services');


let getTokenFromDB = function (userId, userType, tokenObj, callback) {
    var token = tokenObj.token;
    var criteria = {
        _id: userId,
        $or:[ {accessToken:token}, {webAccessToken:token} ]
    };
    var userData = null;

    async.series([
        function (cb) {
            switch(userType){
                case Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER :
                    Service.UserService.getUser(criteria,{},{lean:true}, function (err, dataAry) {
                        if (err){
                            cb(err)
                        }else {
                            if (dataAry && dataAry.length > 0){
                                userData = dataAry[0];
                                cb();
                            }else {
                                cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
                            }
                        }

                    });
                    break;
                default :
                    cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);

            }
        }
    ], function (err, result) {
        if (err){
            callback(err)
        }else {
            if (userData && userData._id){
                userData.id = userData._id;
                userData.type = userType;
                userData.platform = tokenObj.platform;
            }
            callback(null,{userData: userData})
        }

    });
};

let setTokenInDB = function (userId, userType, tokenToSave, callback) {

    var criteria = {
        _id: userId
    };

    var setQuery = {
        accessToken : tokenToSave
    };

    async.series([
        function (cb) {
            switch(userType){
                case Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER:
                    Service.UserService.updateUser(criteria,setQuery,{new:true}, function (err, dataAry) {
                        console.log("err", err, dataAry);
                        if (err){
                            cb(err)
                        }else {
                            if (dataAry && dataAry._id){
                                cb();
                            }else {
                                cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                            }
                        }
                    });
                    break;
                default :
                    cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            }
        }
    ], function (err, result) {
        if (err){
            callback(err)
        }else {
            callback()
        }

    });
};

let verifyToken = function (token, callback) {
    let response = {
        valid: false
    };
    Jwt.verify(token, Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY, function (err, decoded) {
        console.log('jwt err',err,decoded);
        if (err) {
            callback(err)
        } else {
            var obj = {
                token : token,
                platform : decoded.platform ? decoded.platform : "mobile"
            };
            getTokenFromDB(decoded.id, decoded.type, obj, callback);
        }
    });
};

let setToken = function (tokenData, callback) {
    if (!tokenData.id || !tokenData.type) {
        callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    } else {
        let tokenToSend = Jwt.sign(tokenData, Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY);
        console.log('token returns >>>>',tokenData.id,tokenData.type,tokenToSend);
        setTokenInDB(tokenData.id, tokenData.type, tokenToSend, function (err, data) {
            console.log('token >>>>',err,data);
            callback(err, {accessToken: tokenToSend})
        });
    }
};

let decodeToken = function (token, callback) {
    Jwt.verify(token, Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY, function (err, decodedData) {
        if (err) {
            callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
        } else {
            callback(null, decodedData)
        }
    })
};

module.exports = {
    setToken: setToken,
    verifyToken: verifyToken,
    decodeToken: decodeToken
};
