'use strict';
/**
 * Created by Naresh Thakur on 24/06/17.
 */

const CONFIG = require('../Config');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const async = require('async');
const Path = require('path');
const knox = require('knox');
const fsExtra = require('fs-extra');
const fs= require('fs');
const AWS = require('aws-sdk');

let deleteFile= function deleteFile(path, callback) {

    fs.unlink(path, function (err) {
        console.error("delete", err);
        if (err) {
            let error = {
                response: {
                    message: "Something went wrong",
                    data: {}
                },
                statusCode: 500
            };
            return callback(error);
        } else
            return callback(null);
    });

};

let uploadImageToS3Bucket= function uploadImageToS3Bucket(file, isThumb, callback) {

    let path = file.path, filename = file.name, folder = file.s3Folder, mimeType = file.mimeType;
    if (isThumb) {
        path = path + 'thumb/';
        filename = file.thumbName;
        folder = file.s3FolderThumb;
    }
    let accessKeyId = CONFIG.awsS3Config.s3BucketCredentials.accessKeyId;
    let secretAccessKeyId = CONFIG.awsS3Config.s3BucketCredentials.secretAccessKey;
    console.log("path to read::"+path + filename);
    fs.readFile(path + filename, function (error, fileBuffer) {
        console.log("path to read from temp::"+path + filename);
        if (error) {
            console.error("UPLOAD", error,fileBuffer);
            let errResp = {
                response: {
                    message: "Something went wrong",
                    data: {}
                },
                statusCode: 500
            };
            return callback(errResp);
        }

        //filename = file.name;
         AWS.config.update({accessKeyId: accessKeyId, secretAccessKey: secretAccessKeyId});
        let s3bucket = new AWS.S3();
        let params = {
            Bucket: CONFIG.awsS3Config.s3BucketCredentials.bucket,
            Key: folder + '/' + filename,
            Body: fileBuffer,
            ACL: 'public-read',
            ContentType: mimeType
        };

        s3bucket.putObject(params, function (err, data) {
            console.error("PUT", err,data);
            if (err) {
                let error = {
                    response: {
                        message: "Something went wrong",
                        data: {}
                    },
                    statusCode: 500
                };
                return callback(error);
            }
            else {
                console.log(data);
                deleteFile(path + filename, function (err) {
                    console.error(err);
                    if (err)
                        return callback(err);
                    else
                        return callback(null);
                })
            }
        });
    });
};

function initParallelUpload(fileObj, withThumb, callbackParent) {

    async.parallel([
        function (callback) {
            console.log("uploading image");
            uploadImageToS3Bucket(fileObj, false, callback);
        },
        function (callback) {
            if (withThumb)
            {
                console.log("uploading thumbnil");
                uploadImageToS3Bucket(fileObj, true, callback);
            }
            else
                callback(null);
        }
    ], function (error) {
        if (error)
            callbackParent(error);
        else
            callbackParent(null);
    })

}
let saveFile= function saveFile(fileData, path, callback) {
    let file = fs.createWriteStream(path);
    console.log("=========save file======");
    file.on('error', function (err) {

        console.error('@@@@@@@@@@@@@',err);
        let error = {
            response: {
                message: "Some",
                data: {}
            },
            statusCode: 500
        };
        return callback(error);
    });

    fileData.pipe(file);

    fileData.on('end', function (err) {
        if (err) {
            let error = {
                response: {
                    message: "Some",
                    data: {}
                },
                statusCode: 500
            };
            return callback(error);
        } else
            callback(null);
    });


};
let createThumbnailImage= function createThumbnailImage(path, name, callback) {
    console.log('------first-----');
    let gm = require('gm').subClass({imageMagick: true});
    let thumbPath = path + 'thumb/' + "Thumb_" + name;
    gm(path + name)
        .resize(160, 160, "!")
        .autoOrient()
        .write(thumbPath, function (err) {
            console.log('createThumbnailImage');
            console.error(err);

            if (!err) {
                return callback(null);
            } else {
                let error = {
                    response: {
                        message: "Something went wrong",
                        data: {}
                    },
                    statusCode: 500
                };
                console.log('<<<<<<<<<<<<<<<<<',error);
                return callback(error);
            }
        })
};
function uploadFile(otherConstants, fileDetails, createThumbnail, callbackParent) {
    let filename = fileDetails.name;
    let TEMP_FOLDER = otherConstants.TEMP_FOLDER;
    let s3Folder = otherConstants.s3Folder;
    let file = fileDetails.file;
    let mimiType = file.hapi.headers['content-type'];
    async.waterfall([
        function (callback) {
            console.log('TEMP_FOLDER + filename'+ TEMP_FOLDER + filename)
            saveFile(file, TEMP_FOLDER + filename, callback);
            console.log("*******save File******",callback)
        },
        function (callback) {
            if (createThumbnail){
                createThumbnailImage(TEMP_FOLDER, filename, callback);
                console.log("*******thumbnailImage********",callback)
            }

            else
                callback(null);
        },
        function (callback) {
            let fileObj = {
                path: TEMP_FOLDER,
                name: filename,
                thumbName: "Thumb_" + filename,
                mimeType: mimiType,
                s3Folder: s3Folder
            };
            if (createThumbnail)
                fileObj.s3FolderThumb = otherConstants.s3FolderThumb;
            initParallelUpload(fileObj, createThumbnail, callback);
        }
    ], function (error) {
        if (error)
            callbackParent(error);
        else
            callbackParent(null);
    })
};

function uploadProfilePicture(profilePicture, folder, filename, callbackParent) {
    let baseFolder = folder + '/' + CONFIG.awsS3Config.s3BucketCredentials.folder.profilePicture;
    let baseURL = CONFIG.awsS3Config.s3BucketCredentials.s3URL + '/' + baseFolder + '/';
    let urls = {};
    async.waterfall([
            function (callback) {
                let profileFolder = CONFIG.awsS3Config.s3BucketCredentials.folder.original;
                let profileFolderThumb =CONFIG.awsS3Config.s3BucketCredentials.folder.thumb;
                let profilePictureName = UniversalFunctions.generateFilenameWithExtension(profilePicture.hapi.filename, "Profile_" + filename);
                let s3Folder = baseFolder + '/' + profileFolder;
                let s3FolderThumb = baseFolder + '/' + profileFolderThumb;
                let profileFolderUploadPath = "nurse/profilePicture";
                let path = Path.resolve("..") + "/uploads/" + profileFolderUploadPath + "/";
                let fileDetails = {
                    file: profilePicture,
                    name: profilePictureName
                };
                let otherConstants = {
                    TEMP_FOLDER: path,
                    s3Folder: s3Folder,
                    s3FolderThumb: s3FolderThumb
                };
                urls.profilePicture = baseURL + profileFolder + '/' + profilePictureName;
                urls.profilePictureThumb = baseURL + profileFolderThumb + '/Thumb_' + profilePictureName;
                uploadFile(otherConstants, fileDetails, true, callback);
            }
        ],

        function (error) {
            if (error) {
                console.log("upload image error :: ", error);
                callbackParent(error);
            }
            else {
                console.log("upload image result :", urls);


                console.log('hello');
                console.log(urls);
                callbackParent(null, urls);
            }
        })
}

function uploadfileWithoutThumbnail(profilePicture, folder, filename, callbackParent) {
    let baseFolder = folder + '/' + CONFIG.awsS3Config.s3BucketCredentials.folder.docs;
    let baseURL = CONFIG.awsS3Config.s3BucketCredentials.s3URL + '/' + baseFolder + '/';
    let urls = {};
    async.waterfall([
            function (callback) {
                let profileFolder = CONFIG.awsS3Config.s3BucketCredentials.folder.original;
                //let profileFolderThumb =CONFIG.awsS3Config.s3BucketCredentials.folder.thumb;
                let profilePictureName = UniversalFunctions.generateFilenameWithExtension(profilePicture.hapi.filename, "Docs_" + filename);
                let s3Folder = baseFolder + '/' + profileFolder;
                //let s3FolderThumb = baseFolder + '/' + profileFolderThumb;
                let profileFolderUploadPath = "nurses/docs";
                let path = Path.resolve("..") + "/uploads/" + profileFolderUploadPath + "/";
                let fileDetails = {
                    file: profilePicture,
                    name: profilePictureName
                };
                let otherConstants = {
                    TEMP_FOLDER: path,
                    s3Folder: s3Folder
                    //s3FolderThumb: s3FolderThumb
                };
                urls.profilePicture = baseURL + profileFolder + '/' + profilePictureName;
                //urls.profilePictureThumb = baseURL + profileFolderThumb + '/Thumb_' + profilePictureName;
                uploadFile(otherConstants, fileDetails, false, callback);
            }
        ],

        function (error) {
            if (error) {
                console.log("upload image error :: ", error);
                callbackParent(error);
            }
            else {
                console.log("upload image result :", urls);


                console.log('hello');
                console.log(urls);
                callbackParent(null, urls);
            }
        })
}

function saveCSVFile(fileData, path, callback) {
    fsExtra.copy(fileData, path, callback);
}

module.exports = {
    uploadProfilePicture: uploadProfilePicture,
    saveCSVFile:saveCSVFile,
    uploadfileWithoutThumbnail:uploadfileWithoutThumbnail
};