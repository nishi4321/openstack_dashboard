const identity = require("./identity");
const flavor = require("./flavors");
const server = require("./servers");

exports.identity = function (username, password) {
    return new Promise(function (resolve, reject) {
        identity.auth(username, password).then(function (token) {
            resolve(token);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.getflavors = function (token) {
    return new Promise(function (resolve, reject) {
        flavor.getflavors(token).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.getservers = function (token) {
    return new Promise(function (resolve, reject) {
        server.getservers(token).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}