/**
 * Created by Naresh Thakur on 24/06/17.
 */

'use strict';

let mysql = {
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'myapp'
};

let redis = {
    host:"localhost",
    port:6379
};

let mongo = {
    host: 'localhost',
    database: 'myapp',
    password: '',
    user: '',
    debug: false,
    port: 27017
};

if (process.env.NODE_ENV === 'RELEASE') {
     mysql = {
        host     : 'localhost',
        user     : 'user',
        password : 'pass',
        database : 'myapp'
    };

     redis = {
        host:"localhost",
        port:6379
    };

     mongo = {
        host: 'localhost',
        database: 'myapp',
        password: '',
        user: '',
        debug: false,
        port: 27017
    };
}
else if (process.env.NODE_ENV === 'LIVE') {
    mysql = {
        host     : 'localhost',
        user     : 'user',
        password : 'pass',
        database : 'myapp'
    };

    redis = {
        host:"localhost",
        port:6379
    };

    mongo = {
        host: 'localhost',
        database: 'myapp',
        password: '',
        user: '',
        debug: false,
        port: 27017
    };
}
else if (process.env.NODE_ENV === 'PRODUCTION') {
    mysql = {
        host     : 'localhost',
        user     : 'user',
        password : 'pass',
        database : 'myapp'
    };

    redis = {
        host:"localhost",
        port:6379
    };

    mongo = {
        host: 'localhost',
        database: 'myapp',
        password: '',
        user: '',
        debug: false,
        port: 27017
    };
}

module.exports = {
    mongo: mongo,
    redis: redis,
    mysql: mysql
};



