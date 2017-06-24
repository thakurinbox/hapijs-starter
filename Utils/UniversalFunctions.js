/*
* Created by Naresh
*/

//Import External Dependencies
const Joi = require('joi');
const async = require('async');
const MD5 = require('md5');
const Boom = require('boom');
const randomstring = require("randomstring");
const validator = require('validator');
const moment = require('moment');
const bcrypt = require('bcrypt');

const saltRounds = 10;

//Import Internal Dependencies
const CONFIG = require('../Config');
const Models = require('../Models');

let sendError = function (data) {
    console.trace('ERROR OCCURED ', data);
    if (typeof data === 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
        console.log('attaching response type',data.type);
        let errorToSend = Boom.create(data.statusCode, data.customMessage);
        errorToSend.output.payload.responseType = data.type;
        return errorToSend;
    } else {
        let errorToSend = '';
        if (typeof data === 'object') {
            /*if (data.name == 'ApplicationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + ' : ';
            } else if (data.name == 'ValidationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + data.message;
            } else if (data.name == 'CastError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage + CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID.customMessage + data.value;
            }*/
            errorToSend = data.name || "Error";
        } else {
            errorToSend = data
        }
        let customErrorMessage = errorToSend;
        if (typeof customErrorMessage === 'string'){
            if (errorToSend.indexOf("[") > -1) {
                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["));
            }
            customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
        }
        return Boom.create(400,customErrorMessage)
    }
};

let sendSuccess = function (successMsg, data) {
    successMsg = successMsg || CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg === 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return {statusCode:successMsg.statusCode, message: successMsg.customMessage, data: data || {}};

    }else {
        return {statusCode:200, message: successMsg, data: data || {}};

    }
};
let failActionFunction = function (request, reply, source, error) {
    let customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation;
    return reply(error);
};

let authorizationHeaderObj = Joi.object({
    authorization: Joi.string().required()
}).unknown();

let generateRandomString = function () {
    return randomstring.generate(12);
};

let generateRandomNumber = function () {
    let num = Math.floor(Math.random() * 90000) + 10000;
    return num;
};

let generateRandomAlphabet = function (len) {
    let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
        randomString=randomString.toUpperCase();
    }
    return randomString;
};

let CryptData = function (stringToCrypt) {
    return MD5(MD5(stringToCrypt));
};

let validateLatLongValues = function (lat, long) {
    let valid = true;
    if (lat < -90 || lat>90){
        valid = false;
    }
    if (long <-180 || long > 180){
        valid = false;
    }
    return valid;
};

let validateString = function(str, pattern) {
    console.log(str, pattern,str.match(pattern));

    return str.match(pattern) ;
};
let verifyEmailFormat = function (string) {
    return validator.isEmail(string)
};
let deleteUnnecessaryUserData = function (userObj) {
    console.log('deleting>>',userObj);
    delete userObj.__v;
    delete userObj.password;
    delete userObj.registrationDate;
    delete userObj.OTPCode;
    console.log('deleted',userObj);
    return userObj;
};
let generateFilenameWithExtension= function generateFilenameWithExtension(oldFilename, newFilename) {
    let ext = oldFilename.substr((~-oldFilename.lastIndexOf(".") >>> 0) + 2);
    return newFilename + '.' + ext;
};


function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj === null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and toValue enumeration bugs in IE < 9

    return true;
}

let getTimestamp = function (inDate) {
    if (inDate)
        return new Date();

    return new Date().toISOString();
};

let createArray = function(List, keyName) {
    let IdArray = [];
    let keyNameNew = keyName;
    for (let key in List) {
        if (List.hasOwnProperty(key)) {
            IdArray.push((List[key][keyNameNew]).toString());
        }
    }
    return IdArray;

};
function getRange(startDate, endDate, diffIn) {

    let dr = moment.range(startDate, endDate);

    if (!diffIn)
        diffIn = CONFIG.APP_CONSTANTS.TIME_UNITS.HOURS;
    if (diffIn === "milli")
        return dr.diff();

    return dr.diff(diffIn);

}

function cryptPassword(password,callback){
    bcrypt.hash(password, saltRounds, function(err, hash) {
        callback(err,hash);
    });
}

function decryptPassword(password,hash,callback){
    bcrypt.compare(password, hash, callback);
}

module.exports = {
	generateRandomString: generateRandomString,
    CryptData: CryptData,
    CONFIG: CONFIG,
    sendError: sendError,
    sendSuccess: sendSuccess,
    failActionFunction: failActionFunction,
    authorizationHeaderObj: authorizationHeaderObj,
    validateLatLongValues:validateLatLongValues,
    validateString:validateString,
    verifyEmailFormat:verifyEmailFormat,
    deleteUnnecessaryUserData:deleteUnnecessaryUserData,
    generateFilenameWithExtension:generateFilenameWithExtension,
    isEmpty:isEmpty,
    getTimestamp:getTimestamp,
    generateRandomNumber:generateRandomNumber,
    createArray:createArray,
    cryptPassword : cryptPassword,
    decryptPassword : decryptPassword,
    generateRandomAlphabet:generateRandomAlphabet,
    getRange:getRange
};
