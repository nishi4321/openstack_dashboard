const identity = require("./identity");
const flavor = require("./flavors");
const server = require("./servers");
const quota = require("./quota");
const image = require("./image");

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

exports.getserverdetail = function (token, serverid) {
    return new Promise(function (resolve, reject) {
        server.getserverdetail(token, serverid).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.deleteinstance = function (token, serverid) {
    return new Promise(function (resolve, reject) {
        server.deleteinstance(token, serverid).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.getquotas = function (token, projectid) {
    return new Promise(function (resolve, reject) {
        quota.getquotas(token, projectid).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.getimages = function (token) {
    return new Promise(function (resolve, reject) {
        image.getimage(token).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}



exports.createinstance = function (token, name, image, flavor, password) {
    return new Promise(function (resolve, reject) {
        server.createinstance(token, name, image, flavor, password).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}