
var twilioSid = 'AC3846d8eb41811dd2320dfcca4d790d34'; // Your Account SID from www.twilio.com/console
var twilioToken = 'e4cc153f8c3a04412622ab71a2233256';   // Your Auth Token from www.twilio.com/console


var twilio = require('twilio');
var twilioClient = new twilio(twilioSid, twilioToken);


var twilioMessage = function (user, callback){

    twilioClient.messages.create({
        body: user.otp,
        to: user.countryCode + user.phoneNumber,  // Text this number
        from: '+18135270312' // From a valid Twilio number
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