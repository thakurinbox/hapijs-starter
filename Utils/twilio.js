
var twilioSid = 'xxxxxxxxxxxxxxxxxxxxxx'; // Your Account SID from www.twilio.com/console
var twilioToken = 'xxxxxxxxxxxxxxxxxxxxxx';   // Your Auth Token from www.twilio.com/console


var twilio = require('twilio');
var twilioClient = new twilio(twilioSid, twilioToken);


var twilioMessage = function (user, callback){

    twilioClient.messages.create({
        body: user.otp,
        to: user.countryCode + user.phoneNumber,  // Text this number
        from: '+xxxxxxxxx' // From a valid Twilio number
    }, function(err, message) {
        if(err){
            callback(err);
        }else{
            console.log(message.sid);
            callback();
        }
    });
}

module.exports = {
    twilioMessage : twilioMessage
}