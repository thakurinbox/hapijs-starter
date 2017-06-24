/*
* Created by Naresh Thakur on 24/06/17.
*/
'use strict';


const SERVER = {
    APP_NAME: 'NodeBase',
    PORTS: {
        HAPI : 3000
    },
    TOKEN_EXPIRATION_IN_MINUTES: 600,
    JWT_SECRET_KEY: 'sUPerSeCuREKeY&^$^&$^%$^%7782348723t4872t34Ends',
    COUNTRY_CODE : '+91',
    DOMAIN_NAME : 'http://localhost:3000/',
    WEBSITE_LINK : "http://localhost"
};

if (process.env.NODE_ENV === 'RELEASE') {
    SERVER.PORTS.HAPI = 3000;
}else if (process.env.NODE_ENV === 'LIVE') {
    SERVER.PORTS.HAPI = 3000;
}else if (process.env.NODE_ENV === 'PRODUCTION') {
    SERVER.PORTS.HAPI = 3000;
}


const SOCIAL = {
    FACEBOOK: "FACEBOOK",
    TUMBLR: "TUMBLR",
    INSTAGRAM: "INSTAGRAM",
    TWIITER: "TWITTER",
    PINTEREST: "PINTEREST",
    LINKEDIN: "LINKEDIN",
    GOOGLE: "GOOGLE"
};

const swaggerDefaultResponseMessages = [
    {code: 200, message: 'OK'},
    {code: 400, message: 'Bad Request'},
    {code: 401, message: 'Unauthorized'},
    {code: 404, message: 'Page Not Found'},
    {code: 500, message: 'Internal Server Error'}
];

const DATABASE = {
    DEVICE_TYPES:{
        ANDROID:"ANDROID",
        IOS:"IOS",
        WEB:"WEB"
    },
    USER_ROLES:{
        ADMIN : "ADMIN",
        USER:"USER",
        MERCHANT:"MERCHANT"
    }
};

var STATUS_MSG = {
    ERROR: {
        DEFAULT: {
            statusCode:400,
            customMessage : 'Error',
            type : 'DEFAULT'
        },
        USER_ALREADY_REGISTERED:{
            statusCode:409,
            customMessage : 'You are already registered with us',
            type : 'USER_ALREADY_REGISTERED'
        },
        FACEBOOK_ID_PASSWORD_ERROR: {
            statusCode:400,
            customMessage : 'Only one field should be filled at a time, either facebookId or password',
            type : 'FACEBOOK_ID_PASSWORD_ERROR'
        },
        PASSWORD_REQUIRED: {
            statusCode:400,
            customMessage : 'Password is required',
            type : 'PASSWORD_REQUIRED'
        },

        NOT_ADMIN: {
            statusCode:401,
            customMessage : 'You are not authorized.',
            type : 'NOT_ADMIN'
        },
        INVALID_FILE_TYPE: {
            statusCode:400,
            customMessage : 'please select a valid file',
            type : 'INVALID_FILE_TYPE'
        },
        INVALID_COUNTRY_CODE: {
            statusCode:400,
            customMessage : 'Invalid Country Code, Should be in the format +52',
            type : 'INVALID_COUNTRY_CODE'
        },
        INVALID_PHONE_NO_FORMAT: {
            statusCode:400,
            customMessage : 'Phone no. cannot start with 0',
            type : 'INVALID_PHONE_NO_FORMAT'
        },
        IMP_ERROR: {
            statusCode:500,
            customMessage : 'Implementation Error',
            type : 'IMP_ERROR'
        },
        UNIQUE_CODE_LIMIT_REACHED: {
            statusCode:400,
            customMessage : 'Cannot Generate Unique Code, All combinations are used',
            type : 'UNIQUE_CODE_LIMIT_REACHED'
        },
        NO_DEVICE_TOKEN_SELECTED: {
            statusCode:400,
            customMessage : 'NO_DEVICE_TOKEN_SELECTED',
            type : 'NO_DEVICE_TOKEN_SELECTED'
        },
        ALREADY_CONNECTED : {
            statusCode:465,
            customMessage : 'This photo has already been used. Please use a different Photo.',
            type : 'ALREADY_CONNECTED'
        },
        PHONE_NO_EXIST: {
            statusCode:400,
            customMessage : 'Mobile No. Already Exist',
            type : 'PHONE_NO_EXIST'
        },
        PHONE_NO_DOES_NOT_EXIST: {
            statusCode:400,
            customMessage : 'User does not exist!',
            type : 'PHONE_NO_DOES_NOT_EXIST'
        },
        USERNAME_EXIST: {
            statusCode:400,
            customMessage : 'Username Already Exist',
            type : 'USERNAME_EXIST'
        },
        INVALID_TOKEN: {
            statusCode:401,
            customMessage : 'Invalid token provided',
            type : 'INVALID_TOKEN'
        },
        INCORRECT_ACCESSTOKEN: {
            statusCode:403,
            customMessage : 'Incorrect AccessToken',
            type : 'INCORRECT_ACCESSTOKEN'
        },
        INVALID_CODE: {
            statusCode:400,
            customMessage : 'Invalid Verification Code',
            type : 'INVALID_CODE'
        },
        INVALID_PARAMS: {
            statusCode:400,
            customMessage : 'Please enter valid parameters.',
            type : 'INVALID_PARAMS'
        },
        USER_DOES_NOT_EXIST: {
            statusCode:400,
            customMessage : 'User does not exist.',
            type : 'USER_DOES_NOT_EXIST'
        },
        EMAIl_USERNAME_ALREADY_EXISTS: {
            statusCode:400,
            customMessage : 'Please enter a different username and email.',
            type : 'EMAIl_USERNAME_ALREADY_EXISTS'
        },
        EMAIl_ALREADY_EXISTS: {
            statusCode:400,
            customMessage : 'Please enter a different email id.',
            type : 'EMAIl_ALREADY_EXISTS'
        },
        EMAIl_USERNAME_DOES_NOT_EXISTS: {
            statusCode:400,
            customMessage : 'Please provide a valid username.',
            type : 'EMAIl_USERNAME_DOES_NOT_EXISTS'
        },
        ALREADY_DELETED: {
            statusCode:400,
            customMessage : 'This photo has already been deleted.',
            type : 'ALREADY_DELETED'
        },
        LINK_EXPIRED: {
            statusCode:400,
            customMessage : 'Please enter valid parameters.',
            type : 'INVALID_PARAMS'
        },
        OTP_EXPIRED: {
            statusCode:400,
            customMessage : 'Please enter valid OTP.',
            type : 'INVALID_PARAMS'
        },
        USER_NOT_FOUND: {
            statusCode:400,
            customMessage : 'User Not Found',
            type : 'USER_NOT_FOUND'
        },
        INCORRECT_PASSWORD: {
            statusCode:400,
            customMessage : 'Incorrect Password',
            type : 'INCORRECT_PASSWORD'
        },
        USER_NOT_VARIFIED: {
            statusCode:406,
            customMessage : 'Your account is not verified yet!',
            type : 'USER_NOT_VARIFIED'
        },
        NOT_REGISTERED:{
            statusCode:400,
            customMessage : 'You are not registered with YapApp. Kindly register yourself to avail services!',
            type : 'NOT_REGISTERED'
        },
        FACEBOOK_ID_NOT_FOUND: {
            statusCode:400,
            customMessage : 'Facebook Id Not Found',
            type : 'FACEBOOK_ID_NOT_FOUND'
        },
        PHONE_VERIFICATION_COMPLETE: {
            statusCode:400,
            customMessage : 'Your mobile number verification is already completed.',
            type : 'PHONE_VERIFICATION_COMPLETE'
        },
        OTP_CODE_NOT_FOUND:{
            statusCode:400,
            customMessage : 'Otp code not found for this user',
            type : 'OTP_CODE_NOT_FOUND'
        },
        NOT_FOUND: {
            statusCode:400,
            customMessage : 'User Not Found',
            type : 'NOT_FOUND'
        },
        WRONG_PASSWORD: {
            statusCode:400,
            customMessage :'Invalid old password',
            type : 'WRONG_PASSWORD'
        },
        NOT_UPDATE : {
            statusCode:409,
            customMessage : 'New password must be different from old password',
            type : 'NOT_UPDATE'
        },
        ADMIN_NOT_REGISTERED : {
            statusCode:400,
            customMessage : 'This email id is not registered.',
            type : 'ADMIN_NOT_REGISTERED'
        },
        GROUP_MINIMUM_MEMBERS : {
            statusCode:400,
            customMessage : 'Please select atleast 2 members to create a group.',
            type : 'GROUP_MINIMUM_MEMBERS'
        },
        PASSWORD_CHANGE_REQUEST_INVALID: {
            statusCode:400,
            type : 'PASSWORD_CHANGE_REQUEST_INVALID',
            customMessage : 'Invalid password change request.'
        },
        SAME_USER_CONNECTION : {
            statusCode:475,
            type : 'SAME_USER_CONNECTION',
            customMessage : 'You cannot connect with your own photo.'
        },
        USER_NOT_REGISTERED : {
            statusCode:401,
            customMessage : 'User is not registered with us',
            type : 'USER_NOT_REGISTERED'
        },
        PHONE_VERIFICATION: {
            statusCode:400,
            customMessage : 'Your mobile number verification is incomplete.',
            type : ' PHONE_VERIFICATION'
        },
        INCORRECT_ID: {
            statusCode:401,
            customMessage : 'Incorrect Phone Number',
            type : 'INCORRECT_ID'
        },
        INCORRECT_MESSAGE_IDS: {
            statusCode:400,
            customMessage : 'Please enter valid Message Ids.',
            type : 'INCORRECT_MESSAGE_IDS'
        },
        NOT_CONNECTED: {
            statusCode:400,
            customMessage : 'This image is not connected.',
            type : 'NOT_CONNECTED'
        },
        NOT_AUTHORIZED: {
            statusCode:401,
            customMessage : 'You are not authorized.',
            type : 'NOT_AUTHORIZED'
        },
        NOT_VERFIFIED: {
            statusCode:401,
            customMessage : 'User Not Verified',
            type : 'NOT_VERFIFIED'
        },
        PASSWORD_CHANGE_REQUEST_EXPIRE : {
            statusCode:400,
            customMessage : ' Password change request time expired',
            type : 'PASSWORD_CHANGE_REQUEST_EXPIRE'
        }
    },
    SUCCESS: {
        DEFAULT: {
            statusCode: 200,
            customMessage: 'Success',
            type: 'DEFAULT'
        },
        UPDATED: {
            statusCode: 200,
            customMessage: 'Updated Successfully',
            type: 'UPDATED'
        },
        CREATED: {
            statusCode:201,
            customMessage : 'Created Successfully',
            type : 'CREATED'
        },
        VERIFY_COMPLETE: {
            statusCode:200,
            customMessage : 'OTP verification is completed.',
            type : 'VERIFY_SENT'
        },
        VERIFY_SENT: {
            statusCode:200,
            customMessage : 'Your new OTP has been sent to your phone',
            type : 'VERIFY_SENT'
        },
        LOGOUT: {
            statusCode:200,
            customMessage : 'Logged Out Successfully',
            type : 'LOGOUT'
        },
        PASSWORD_RESET: {
            statusCode:200,
            customMessage : 'Password Reset Successfully',
            type : 'PASSWORD_RESET'
        }
    }
};

const notificationMessages = {
    EMAIL_VERIFICATION : {
        subject : "Activate Email - RunSquare",
        body : '<!DOCTYPE html><html lang="en"><head><title>Confirmation Email</title><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style type="text/css"> /* CLIENT-SPECIFIC STYLES */ #outlook a{padding:0;} /* Force Outlook to provide a "view in browser" message */ .ReadMsgBody{width:100%;} .ExternalClass{width:100%;} /* Force Hotmail to display emails at full width */ .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;} /* Force Hotmail to display normal line spacing */ body, table, td, a{-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;} /* Prevent WebKit and Windows mobile changing default text sizes */ table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} /* Remove spacing between tables in Outlook 2007 and up */ img{-ms-interpolation-mode:bicubic;} /* Allow smoother rendering of resized image in Internet Explorer */ /* RESET STYLES */ body{margin:0; padding:0;} img{border:0; height:auto; line-height:100%; outline:none; text-decoration:none;} table{border-collapse:collapse !important;} body{height:100% !important; margin:0; padding:0; width:100% !important;} /* iOS BLUE LINKS */ .appleBody a {color:#68440a; text-decoration: none;} .appleFooter a {color:#999999; text-decoration: none;} /* MOBILE STYLES */ @media screen and (max-width: 525px) { /* ALLOWS FOR FLUID TABLES */ table[class="wrapper"]{ width:100% !important; } /* ADJUSTS LAYOUT OF LOGO IMAGE */ td[class="logo"]{ text-align: left; padding: 20px 0 20px 0 !important; } td[class="logo"] img{ margin:0 auto!important; } /* USE THESE CLASSES TO HIDE CONTENT ON MOBILE */ td[class="mobile-hide"]{ display:none;} img[class="mobile-hide"]{ display: none !important; } img[class="img-max"]{ max-width: 100% !important; height:auto !important; } /* FULL-WIDTH TABLES */ table[class="responsive-table"]{ width:100%!important; } /* UTILITY CLASSES FOR ADJUSTING PADDING ON MOBILE */ td[class="padding"]{ padding: 10px 5% 15px 5% !important; } td[class="padding-copy"]{ padding: 10px 5% 10px 5% !important; text-align: center; } td[class="padding-meta"]{ padding: 30px 5% 0px 5% !important; text-align: center; } td[class="no-pad"]{ padding: 0 0 20px 0 !important; } td[class="no-padding"]{ padding: 0 !important; } td[class="section-padding"]{ padding: 50px 15px 50px 15px !important; } td[class="section-padding-bottom-image"]{ padding: 50px 15px 0 15px !important; } /* ADJUST BUTTONS ON MOBILE */ td[class="mobile-wrapper"]{ padding: 10px 5% 15px 5% !important; } table[class="mobile-button-container"]{ margin:0 auto; width:100% !important; } a[class="mobile-button"]{ width:80% !important; padding: 15px !important; border: 0 !important; font-size: 16px !important; } }</style></head><body style="margin: 0; padding: 0;"><!-- ONE COLUMN SECTION --><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td bgcolor="#ffffff" align="center" style="padding: 70px 15px 70px 15px;" class="section-padding"> <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td> <!-- COPY --> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td style="text-align:center;font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333; padding-top: 30px;" class="padding-copy">Verify your account.</td> </tr> <tr> <td align="center" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">Thanks for signing up. Please click on the button to complete the verification process.</td> </tr> </table> </td> </tr> <tr> <td> <!-- BULLETPROOF BUTTON --> <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container"> <tr> <td align="center" style="padding: 25px 0 0 0;" class="padding-copy"> <table border="0" cellspacing="0" cellpadding="0" class="responsive-table"> <tr> <td style="text-align:center;"><a href="{{verificationLink}}" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #5D9CEC; border-top: 15px solid #5D9CEC; border-bottom: 15px solid #5D9CEC; border-left: 25px solid #5D9CEC; border-right: 25px solid #5D9CEC; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button"> Verify Email </a></td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr></table></body></html>'
    },
    FORGOT_PASSWORD : {
        subject : "Reset password - RunSquare",
        body : '<!DOCTYPE html><html lang="en"><head><title>Forgot Password</title><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style type="text/css"> /* CLIENT-SPECIFIC STYLES */ #outlook a{padding:0;} /* Force Outlook to provide a "view in browser" message */ .ReadMsgBody{width:100%;} .ExternalClass{width:100%;} /* Force Hotmail to display emails at full width */ .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;} /* Force Hotmail to display normal line spacing */ body, table, td, a{-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;} /* Prevent WebKit and Windows mobile changing default text sizes */ table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} /* Remove spacing between tables in Outlook 2007 and up */ img{-ms-interpolation-mode:bicubic;} /* Allow smoother rendering of resized image in Internet Explorer */ /* RESET STYLES */ body{margin:0; padding:0;} img{border:0; height:auto; line-height:100%; outline:none; text-decoration:none;} table{border-collapse:collapse !important;} body{height:100% !important; margin:0; padding:0; width:100% !important;} /* iOS BLUE LINKS */ .appleBody a {color:#68440a; text-decoration: none;} .appleFooter a {color:#999999; text-decoration: none;} /* MOBILE STYLES */ @media screen and (max-width: 525px) { /* ALLOWS FOR FLUID TABLES */ table[class="wrapper"]{ width:100% !important; } /* ADJUSTS LAYOUT OF LOGO IMAGE */ td[class="logo"]{ text-align: left; padding: 20px 0 20px 0 !important; } td[class="logo"] img{ margin:0 auto!important; } /* USE THESE CLASSES TO HIDE CONTENT ON MOBILE */ td[class="mobile-hide"]{ display:none;} img[class="mobile-hide"]{ display: none !important; } img[class="img-max"]{ max-width: 100% !important; height:auto !important; } /* FULL-WIDTH TABLES */ table[class="responsive-table"]{ width:100%!important; } /* UTILITY CLASSES FOR ADJUSTING PADDING ON MOBILE */ td[class="padding"]{ padding: 10px 5% 15px 5% !important; } td[class="padding-copy"]{ padding: 10px 5% 10px 5% !important; text-align: center; } td[class="padding-meta"]{ padding: 30px 5% 0px 5% !important; text-align: center; } td[class="no-pad"]{ padding: 0 0 20px 0 !important; } td[class="no-padding"]{ padding: 0 !important; } td[class="section-padding"]{ padding: 50px 15px 50px 15px !important; } td[class="section-padding-bottom-image"]{ padding: 50px 15px 0 15px !important; } /* ADJUST BUTTONS ON MOBILE */ td[class="mobile-wrapper"]{ padding: 10px 5% 15px 5% !important; } table[class="mobile-button-container"]{ margin:0 auto; width:100% !important; } a[class="mobile-button"]{ width:80% !important; padding: 15px !important; border: 0 !important; font-size: 16px !important; } }</style></head><body style="margin: 0; padding: 0;"><!-- ONE COLUMN SECTION --><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td bgcolor="#ffffff" align="center" style="padding: 70px 15px 70px 15px;" class="section-padding"> <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td> <!-- COPY --> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td style="text-align:center;font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333; padding-top: 30px;" class="padding-copy">Verify your account.</td> </tr> <tr> <td align="center" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">Thanks for signing up. Please click on the button to complete the verification process.</td> </tr> </table> </td> </tr> <tr> <td> <!-- BULLETPROOF BUTTON --> <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container"> <tr> <td align="center" style="padding: 25px 0 0 0;" class="padding-copy"> <table border="0" cellspacing="0" cellpadding="0" class="responsive-table"> <tr> <td style="text-align:center;"><a target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #5D9CEC; border-top: 15px solid #5D9CEC; border-bottom: 15px solid #5D9CEC; border-left: 25px solid #5D9CEC; border-right: 25px solid #5D9CEC; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; display: inline-block;" class="mobile-button"> {{forgotPasswordCode}} </a></td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr></table></body></html>'
    }
};

const TIME_UNITS = {
    MONTHS: 'months',
    HOURS: 'hours',
    MINUTES: 'minutes',
    SECONDS: 'seconds',
    WEEKS: 'weeks',
    DAYS: 'days'
};

module.exports = {
    SERVER: SERVER,
    SOCIAL:SOCIAL,
    TIME_UNITS: TIME_UNITS,
    DATABASE: DATABASE,
    swaggerDefaultResponseMessages: swaggerDefaultResponseMessages,
    STATUS_MSG: STATUS_MSG,
    notificationMessages:notificationMessages
};