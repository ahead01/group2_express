const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
var config = require('../bin/config');
var http = require('http');

var options = {
    host: config.servicehost,
    port: config.serviceport,
    path: '/',
    method: 'GET'
};

exports.instAddOne = function(user, callback){
    options.path = '/inst/add';
    options.method = 'POST';
    options.headers = {"Content-Type": "application/json"};
    var request = http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            console.log('Response BODY: ' + chunk);
            return callback(chunk);
        });
    });

    bcrypt.genSalt(2, function(err, salt) {
        if (err) { return next(err); }
        bcrypt.hash(user.institutionPWD, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.institutionPWD = hash;
            request.write(JSON.stringify(user));
        });
    });

};

exports.getAllInstitutions = function(callback) {
    options.path = '/inst/getall';
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            var institutions = {'list':[]};
            institutions.list = JSON.parse(chunk);
            return(callback(institutions));
        });
    }).end();
};

exports.getFuzzySearchInst = function(srchstr, callback){
    return callback(null);
};



exports.instCheck = function (req,callback){
    console.log(req.body);
    options.path = '/inst/checkone/user?institutionUserName=' + req.body.username;
    options.method = 'GET';
    options.headers = {"Content-Type": "application/json"};
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            return callback(chunk === 'true');
        });
    }).end();
};



exports.instFindByUserName = function(username, callback) {
    var err = null;
    options.path = '/inst/getone/user?institutionUserName=' + username;
    options.method = 'GET';
    options.headers = {"Content-Type": "application/json"};
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
                return callback(null, chunk);
        });
    }).end();
};

exports.compareInstPassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch)  {
        return callback(err, isMatch);
    });
};

exports.isInstPasswordValid = function(rawPassword,hash, callback) {
    //console.log(rawPassword);
    //console.log(hash);
    bcrypt.compare(rawPassword, hash, function(err, same) {
        //console.log('err - same');
        //console.log(err);
        //console.log(same);
        if (err) {
            return(callback(err));
        }
        return(callback(null, same));
    });
};