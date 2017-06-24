/**
 * Created by Naresh on 15/11/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../Config');

var User = new Schema({
    name : {type : String},
    photo : {type : String},
    email : {type : String},
    password : {type : String},
    countryCode : {type : String},
    phoneNumber : {type : String},
    country : {type : String},
    accessToken : {type: String , index : true},
    isVerified : {type : Boolean, default : false},
    otp : {type : String}
});

User.on('index', function(err) {
    if (err) {
        console.error('User index error: %s', err);
    } else {
        console.info('User indexing complete');
    }
});

module.exports = mongoose.model('Users', User);