'use strict';

const apns = require('apn');
const Path = require('path');
const Service = require('../Services');
const Config = require('../Config');
const nodemailer = require('nodemailer');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const util = require('util');
const plivo = require('plivo');
const plivoClient = plivo.RestAPI({
    authId: 'MANGFJMWIXNWU3NZQ0YT',
    authToken: 'N2ViM2I0MDEwNzA3ZGE4MmZlM2NmMDNhYjY5YmE0'
});const poolConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: 'youremail@gmail.com',
        pass: 'sdfas@Me3#'
    }
};

const transporter = nodemailer.createTransport(poolConfig);
const handlebars = require('handlebars');
const ERROR = Config.APP_CONSTANTS.STATUS_MSG.ERROR;
const async = require('async');
const fcm = require('fcm-push');

let production = false;
if (process.env.NODE_ENV === 'LIVE'/* || process.env.NODE_ENV === 'RELEASE'*/) {
    production = true;
}

function sendIosPushNotification(iosDeviceToken, payload , callback) {
    var calling_push = false;
    if(payload.hasOwnProperty("notificationHeader") && payload.notificationHeader == "calling"){
        payload=payload.dataToSend;
        var timeToLive = Math.floor(Date.now() / 1000) + 15;
        calling_push = true;
        var iosApnCertificate = Config.pushConfig.iOSPushSettings.user.iosVoipCertificate;
    }
    else{
        if(payload.key_type && (payload.key_type == "chat" || payload.key_type== "photos")){
            payload = payload;
            var timeToLive = Math.floor(Date.now() / 1000) + 3600;
            var iosApnCertificate = Config.pushConfig.iOSPushSettings.user.iosVoipCertificate;
        }
        else{
            payload = payload;
            var timeToLive = Math.floor(Date.now() / 1000) + 3600;
            var iosApnCertificate = Config.pushConfig.iOSPushSettings.user.iosApnCertificate;
        }

    }
    //var iosApnCertificate = Config.pushConfig.iOSPushSettings.user.iosApnCertificate;
    var certificate = null;
    var push_success = true;
    certificate = Path.resolve(".") + iosApnCertificate;
    console.log(">>>",iosDeviceToken,certificate);

    var status = 1;
    var snd = 'ping.aiff';
    //if (flag == 4 || flag == 6) {
    //    status = 0;
    //    msg = '';
    //    snd = '';
    //}
    var options = {
        cert: certificate,
        certData: null,
        key: certificate,
        keyData: null,
        passphrase: '',
        ca: null,
        pfx: null,
        pfxData: null,
        port: 2195,
        rejectUnauthorized: true,
        enhanced: true,
        cacheLength: 100,
        autoAdjustCache: true,
        connectionTimeout: 0,
        ssl: true,
        debug : true,
        production : production,
        errorCallback: apnErrorCallback
    };

    function log(type) {
        return function () {
            console.log("iOS PUSH NOTIFICATION RESULT: " + type);
            if(type == "transmitted"){
                setTimeout(function(){ if(push_success){
                    console.log("already called");
                    //callback(null,{response:"success"})
                }  }, 500);
            }
        }
    }

    function apnErrorCallback(errorCode, notification, recipient) {
        console.log("apnErrorCallback");
        console.log("Error Code: " + errorCode);
        console.log("Notification: " + notification);
        push_success = false;
        /*if(calling_push){
         callback(errorCode,{response:"apnErrorCallback"});
         }
         else callback(null,{response:"success"});*/
    }

    if (iosDeviceToken && iosDeviceToken.length > 0){
        iosDeviceToken.forEach(function (tokenData) {
            try {
                var deviceToken = new apns.Device(tokenData);
                var apnsConnection = new apns.Connection(options);
                var note = new apns.Notification();

                note.expiry = timeToLive ;
                //note.contentAvailable = 1;
                note.sound = "";

                note.newsstandAvailable = status;
                note.payload = {
                    notificationData : payload,
                    notificationSound : snd
                };
                //console.log("pushType : ",payload,payload.notificationData.pushType,payload.notificationData.pushType == 1);
                if(payload && payload.notificationData && payload.notificationData.pushType && payload.notificationData.pushType == 1){
                    console.log("Push type  = 1");
                    note.alert = payload.notificationData.message;
                }
                else{
                    note.contentAvailable = 1;
                    note.alert = "";
                }
                /*note.payload = {
                 notificationData : payload,
                 notificationSound : snd
                 };*/
                console.log("payload for ios Push : ",payload,note);
                console.log("*********************payload for ios Push expanded : ",util.inspect(payload,false,null));

                //console.log("payload.badgeCount : ",payload.notificationData.badgeCount);
                if(payload && payload.notificationData && payload.notificationData.badgeCount){
                    console.log("badge count",payload.notificationData.badgeCount);
                    note.badge = payload.notificationData.badgeCount;
                }

                apnsConnection.pushNotification(note, deviceToken);
                // Handle these events to confirm that the notification gets
                // transmitted to the APN server or find error if any
                apnsConnection.on('error', log('error'));
                apnsConnection.on('transmitted', log('transmitted'));
                apnsConnection.on('timeout', log('timeout'));
                apnsConnection.on('connected', log('connected'));
                apnsConnection.on('disconnected', log('disconnected'));
                apnsConnection.on('socketError', log('socketError'));
                apnsConnection.on('transmissionError', log('transmissionError'));
                apnsConnection.on('cacheTooSmall', log('cacheTooSmall'));
                callback();
            }catch(e){
                console.trace('exception occured',e);
                callback();
            }
        })
    }
}

function sendEmail(templateName, varToReplace , email) {
    var template = Config.APP_CONSTANTS.notificationMessages[templateName].body;
    var handlebarTemplate = handlebars.compile(template);
    var result = handlebarTemplate(varToReplace);
    var mailOptions = {
        from: 'Naresh Thakur<youremail@gmail.com>', // sender address
        to: email,
        subject: Config.APP_CONSTANTS.notificationMessages[templateName].subject, // Subject line
        html: result // html body
    };
    // send mail with defined transport object
    console.log("mailOptions : ",mailOptions);
    transporter.sendMail(mailOptions, function(error, info){
        console.log("Error : ",error);
        console.log('Message sent: ', info);
    });
}


/******************************************/
/* Function name :  sendConnectionPush
 /* Params : userId : {user to send push to}
 /* Created By : Naresh Thakur on 24/06/17.
 /* Modified By :
 /* Date :
 /******************************************/
function sendConnectionPush(userId,message,callback) {
    Service.UserService.getOnlyUser({_id:userId},{},{lean:true},function (err,data) {
        if(data && data.deviceToken){
            console.log("\n\nPush sent to "+data.deviceType+" user with ID : "+userId+" and deviceToken : "+data.deviceToken,message);
            console.log('sendPushToAgent',message);

            var deviceToken = data.deviceToken;
            var deviceType = data.deviceType;
            console.log("Voip Token Used>>>>>>>>>>>>>>",message.hasOwnProperty("notificationHeader"),message.notificationHeader == "calling")
            if(message.hasOwnProperty("notificationHeader") && message.notificationHeader == "calling" && deviceType=="IOS"){
                console.log("Voip Token Used>>>>>>>>>>>>>>",data.voipToken)
                deviceToken = data.voipToken;
            }

            var dataToSend = message;
            if (deviceType == Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES.ANDROID || deviceType == Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES.IOS) {
                if (deviceType == Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES.ANDROID) {
                    console.log('Android Push Notification');
                    console.log([deviceToken], dataToSend);
                    sendAndroidPush([deviceToken], dataToSend, function (err,response) {
                        callback(err,response);
                    });
                } else if (deviceType == Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES.IOS) {
                    console.log('IOS Push Notification');
                    sendIosPushNotification([deviceToken], dataToSend, function (err,response) {
                        callback(err,response);
                    });
                }
            } else {
                callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
            }
        }
        else{
            console.log("\n\n\n\n\n ************************Device Token Not Found**********************\n\n\n\n\n");
            callback();
        }
    });
}

function sendAndroidPush(deviceTokens,messageObj , callback){

    var sender = null;
    var calling_push = false;
    sender = new fcm(Config.pushConfig.androidPushSettings.user.fcmSender);
    if(deviceTokens && deviceTokens.length>0){
        deviceTokens.forEach(function (tokenData) {
            if(messageObj.hasOwnProperty("notificationHeader") && messageObj.notificationHeader == "calling"){
                calling_push = true;
                var dataToAttach = {
                    message: messageObj.dataToSend,
                    message_1: messageObj.dataToSend
                };
                var message = {
                    to: tokenData,
                    collapse_key: "Nihao",
                    "priority" : "high",
                    // "notification" :{
                    //     title:dataToAttach
                    // },
                    data: dataToAttach,
                    "delay_while_idle":false,
                    "time_to_live" : 0
                };
            }
            else{
                var message = {
                    to: tokenData,
                    "priority" : "high",
                    // "notification" :{
                    //     title:messageObj
                    // },
                    data: messageObj

                };
            }
            console.log(message);
            console.log(">>>>>>>>>>>>",JSON.stringify(message.data.message_1.notificationMessage_1));
            sender.send(message, function (err, result) {
                console.log("Send Notification");
                console.log("ANDROID NOTIFICATION RESULT: " + result);
                console.log("ANDROID NOTIFICATION ERROR: " + err);

                if(err){
                    if(calling_push){
                        callback(err);
                    }
                    else {
                        callback(null,{response:"success"});
                    }
                }
                else  {
                    callback(null,result)
                }

            });
        })
    }
    else{
        console.log("No Device Token ");
        callback();
    }
}

function sendPush(pushType, userId,callback){
    var dataToSend = {};
    var userIdToSent = userId;
    async.series([
        function (cb) {
            console.log("*****************sendPush : ",userId);

            if(pushType.hasOwnProperty("notificationHeader") && pushType.notificationHeader == "calling"){
                var message = pushType;
            }
            else{
                var message = Config.APP_CONSTANTS.notificationMessages[pushType];
                console.log("*****************sendPush else message: ",message,userId);
                if(typeof userId === "object" && userId.to){
                    userIdToSent = userId.to;
                    message.showPreview = userId.photoId;
                    dataToSend= {
                        data:{
                            message:Config.APP_CONSTANTS.notificationMessages[pushType].notificationMessage,
                            showPreview : userId.photoId,
                            thumb: userId.thumb
                        },
                        type: userId.type || Config.APP_CONSTANTS.notificationMessages[pushType].type,
                        notificationStatus:Config.APP_CONSTANTS.notificationMessages[pushType].notificationStatus
                    }
                    pushType = userId.type || Config.APP_CONSTANTS.notificationMessages[pushType].type;
                    console.log("*****************sendPush else message object: ",userIdToSent,message);
                }
                else{
                    pushType = Config.APP_CONSTANTS.notificationMessages[pushType].type;
                }
            }
            //sendConnectionPush(userIdToSent,message,cb);
            cb()
        },
        function (cb) {
            if(pushType.hasOwnProperty("notificationHeader") && pushType.notificationHeader == "calling"){
                dataToSend = pushType;
                pushType = pushType.dataToSend.notificationMessage.type
            }
            console.log(">>>>>>>>>>>>",pushType,dataToSend)
            sendPushWithData(pushType,dataToSend,userIdToSent,"photos",cb);
        }
    ],callback);

}

function sendPushWithData(pushType, data, userIdToSendTo,keyType, callback) {

    console.log("*****************sendPushWithData");
    if(data.hasOwnProperty("notificationHeader") && data.notificationHeader == "calling"){
        data.dataToSend.type = pushType;
        data.dataToSend.notificationMessage_1 = data.dataToSend.notificationMessage;
        data.dataToSend.notificationMessage = undefined;
        message = data;
    }
    else{
        var message = {
            key_type : keyType,
            type : pushType,
            notificationMessage_1 : data
        };

    }
    var deviceToken = "";
    var deviceType = "";
    async.series([
        function (cb) {
            Service.UserService.getOnlyUser({_id:userIdToSendTo},{},{lean:true},function (err,userData) {
                if(userData && userData.deviceToken){
                    console.log("\n\nPush sent to "+userData.deviceType+" user with ID : "+userIdToSendTo+" and deviceToken : "+userData.deviceToken);
                    console.log('sendPushToAgent',message);
                    deviceToken = userData.deviceToken;
                    deviceType = userData.deviceType;
                    if(data.hasOwnProperty("notificationHeader") && data.notificationHeader == "calling" && deviceType=="IOS"){
                        deviceToken = userData.voipToken;
                    }
                    if((keyType == "chat" || keyType == "photos") && deviceType=="IOS"){
                        deviceToken = userData.voipToken;
                    }
                    cb();
                }
                else{
                    console.log("\n\n\n\n\n ************************Device Token Not Found**********************\n\n\n\n\n");
                    cb();
                }
            });
        },
        function (cb) {

            console.log([deviceToken], message);

            if (deviceType == Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES.ANDROID) {
                console.log('Android Push Notification');
                message.message_1 = {
                    key_type : keyType,
                    type : pushType,
                    notificationMessage_1 : data
                };
                sendAndroidPush([deviceToken], message, cb);
            } else if (deviceType == Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES.IOS) {
                console.log('IOS Push Notification');
                sendIosPushNotification([deviceToken], message, cb);
            }
            else{
                cb();
            }
        }
    ],callback);
}

function sendChatPush(pushType, data,callback){
    async.parallel([
        function (cb) {

            console.log("Sending Old Push");
            var message = Config.APP_CONSTANTS.notificationMessages[pushType];
            message.notificationData = data.messageData;
            //sendConnectionPush(data.userId,message,cb);
            cb()
        },
        function (cb) {
            sendPushWithData(data.type,data.messageData,data.userId,"chat",cb);
        }
    ],callback);

}


function sendMultipleAndroidPush(deviceTokens,messageObj , callback){

    var sender = null;
    sender = new fcm(Config.pushConfig.androidPushSettings.user.fcmSender);
    if(deviceTokens && deviceTokens.length>0){
        var message = {
            registration_ids: deviceTokens,
            "priority" : "high",
            data: messageObj
        };
        console.log(message);
        sender.send(message, function (err, result) {
            console.log("Send Notification size",JSON.stringify(message).length);
            console.log("ANDROID NOTIFICATION RESULT: " + result);
            console.log("ANDROID NOTIFICATION ERROR: " + err);
            if(JSON.stringify(message).length > 2000){
                sendEmail("pushOverSize",{},Config.APP_CONSTANTS.SERVER.ERROR_REPORT_EMAIL,callback);
            }
            else{
                if(err){
                    callback(null,{response:"success"});
                }
                else  {
                    callback(null,result)
                }
            }
        });
    }
    else{
        console.log("No Device Token ");
        callback();
    }
}


function sendMutipleIosPushNotification(iosDeviceToken, payload , silent, callback) {
    var timeToLive;
    var iosApnCertificate;
    if(silent){
        timeToLive = Math.floor(Date.now() / 1000) + 3600;
        iosApnCertificate = Config.pushConfig.iOSPushSettings.user.iosVoipCertificate;
    }
    else{
        timeToLive = Math.floor(Date.now() / 1000) + 3600;
        iosApnCertificate = Config.pushConfig.iOSPushSettings.user.iosApnCertificate;
    }

    var certificate = null;
    var push_success = true;
    certificate = Path.resolve(".") + iosApnCertificate;
    console.log("IOS notification size",JSON.stringify(payload).length);
    console.log(">>>",iosDeviceToken,certificate);

    var status = 1;
    var snd = 'ping.aiff';
    var options = {
        cert: certificate,
        certData: null,
        key: certificate,
        keyData: null,
        passphrase: '',
        ca: null,
        pfx: null,
        pfxData: null,
        port: 2195,
        rejectUnauthorized: true,
        enhanced: true,
        cacheLength: 100,
        autoAdjustCache: true,
        connectionTimeout: 0,
        ssl: true,
        debug : true,
        production : production,
        errorCallback: apnErrorCallback
    };

    function log(type) {
        return function () {
            console.log("iOS PUSH NOTIFICATION RESULT: " + type);
            if(type == "transmitted"){
                setTimeout(function(){ if(push_success){
                    console.log("already called");
                    //callback(null,{response:"success"})
                }  }, 500);
            }
        }
    }

    function apnErrorCallback(errorCode, notification, recipient) {
        console.log("apnErrorCallback");
        console.log("Error Code: " + errorCode);
        console.log("Notification: " + notification);
        push_success = false;
        //callback(null,{response:"success"});
    }

    if (iosDeviceToken && iosDeviceToken.length > 0){
        try {
            //var iosDeviceToken = new apns.Device(iosDeviceToken);
            var apnsConnection = new apns.Connection(options);
            var note = new apns.Notification();

            note.expiry = timeToLive ;
            //note.contentAvailable = 1;
            note.sound = "";

            note.newsstandAvailable = status;
            note.payload = {
                notificationData : payload,
                notificationSound : snd
            };
            //console.log("pushType : ",payload,payload.notificationData.pushType,payload.notificationData.pushType == 1);
            if(payload && payload.notificationData && payload.notificationData.pushType && payload.notificationData.pushType == 1){
                console.log("Push type  = 1");
                note.alert = payload.notificationData.message;
            }
            else{
                note.contentAvailable = 1;
                note.alert = "";
            }
            /*note.payload = {
             notificationData : payload,
             notificationSound : snd
             };*/
            console.log("payload for ios Push : ",payload,note,Buffer.byteLength(payload, 'utf8'));
            console.log("*********************payload for ios Push expanded : ",util.inspect(payload,false,null));
            //console.log("payload.badgeCount : ",payload.notificationData.badgeCount);
            if(payload && payload.notificationData && payload.notificationData.badgeCount){
                console.log("badge count",payload.notificationData.badgeCount);
                note.badge = payload.notificationData.badgeCount;
            }
            apnsConnection.pushNotification(note, iosDeviceToken);
            // Handle these events to confirm that the notification gets
            // transmitted to the APN server or find error if any
            apnsConnection.on('error', log('error'));
            apnsConnection.on('transmitted', log('transmitted'));
            apnsConnection.on('timeout', log('timeout'));
            apnsConnection.on('connected', log('connected'));
            apnsConnection.on('disconnected', log('disconnected'));
            apnsConnection.on('socketError', log('socketError'));
            apnsConnection.on('transmissionError', log('transmissionError'));
            apnsConnection.on('cacheTooSmall', log('cacheTooSmall'));
            callback();
        }catch(e){
            console.trace('exception occured',e);
            if(JSON.stringify(payload).length > 2000){
                sendEmail("pushOverSize",{},Config.APP_CONSTANTS.SERVER.ERROR_REPORT_EMAIL,callback);
            }
            else{
                callback();
            }
        }
    }
}

let sendMessage = function (to, message) {
    let params = {
        'src': '+918566829154',
        'dst' : to,
        'text' : message
    };
    plivoClient.send_message(params, function (err, response) {
        console.log('Send Message Error: ', err);
        console.log('Send Message Response:\n', response);
    });
};

module.exports  = {
    sendIosPushNotification : sendIosPushNotification,
    sendConnectionPush : sendConnectionPush,
    sendEmail : sendEmail,
    sendAndroidPush : sendAndroidPush,
    sendPush : sendPush,
    sendChatPush: sendChatPush,
    sendPushWithData : sendPushWithData,
    sendMultipleAndroidPush : sendMultipleAndroidPush,
    sendMutipleIosPushNotification : sendMutipleIosPushNotification,
    sendMessage : sendMessage
};