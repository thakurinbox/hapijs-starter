/**
 * Created by Naresh Thakur on 24/06/17.
 */
'use strict';

let Models = require('../Models');

let updateUser = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Users.findOneAndUpdate(criteria, dataToSet, options, callback);
};
//Insert User in DB
let createUser = function (objToSave, callback) {
    new Models.Users(objToSave).save(callback)
};
//Delete User in DB
let deleteUser = function (criteria, callback) {
    Models.Users.findOneAndRemove(criteria, callback);
};

//Get Users from DB
let getUser = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Users.find(criteria, projection, options, callback).populate([{path:'profilePics', select:'photo_url thumb smartURL qrCode'}]);
};

let getUserWithoutPopulate = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Users.find(criteria, projection, options, callback);
};

//Get Users from DB
let getOnlyUser = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Users.findOne(criteria, projection, options, callback).populate([{path:'profilePics', select:'photo_url thumb smartURL qrCode'}]);
};

let getAllGeneratedCodes = function (callback) {
    let criteria = {
        OTPCode : {$ne : null}
    };
    let projection = {
        OTPCode : 1
    };
    let options = {
        lean : true
    };
    Models.Users.find(criteria,projection,options, function (err, dataAry) {
        if (err){
            callback(err)
        }else {
            let generatedCodes = [];
            if (dataAry && dataAry.length > 0){
                dataAry.forEach(function (obj) {
                    generatedCodes.push(obj.OTPCode.toString())
                });
            }
            callback(null,generatedCodes);
        }
    })
};

let getUsersCount = function (criteria, callback) {
    Models.Users.count(criteria, callback);
};

let getAggregatedData = function (criteria,callback) {
    Models.Users.aggregate(criteria, callback);
};

let updateAllUsers = function (criteria, setQuery, options, callback) {
    Models.Users.update(criteria,setQuery,options,callback);
};

module.exports = {
    updateUser: updateUser,
    createUser: createUser,
    updateAllUsers: updateAllUsers,
    deleteUser: deleteUser,
    getUser:getUser,
    getAllGeneratedCodes:getAllGeneratedCodes,
    getOnlyUser :getOnlyUser,
    getUsersCount : getUsersCount,
    getAggregatedData : getAggregatedData,
    getUserWithoutPopulate : getUserWithoutPopulate
};