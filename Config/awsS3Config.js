'use strict';

const s3BucketCredentials = {
    "bucket": "prosimple",
    "accessKeyId": "AKIAIPFSSTK4UKWGCK5A",
    "secretAccessKey": "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",
    "s3URL": "http://prosimple.s3.amazonaws.com",
    "folder": {
        "profilePicture": "profilePicture",
        "thumb": "thumb",
        "customer":"customer",
        "category":"category",
        "jobimages":"jobimages"
    },
    "agentDefaultPicUrl": "http://instamow.s3.amazonaws.com/agent/profilePicture/default.png",
    "fbUrl": "https://graph.facebook.com/"
};

module.exports = {
    s3BucketCredentials: s3BucketCredentials
};
