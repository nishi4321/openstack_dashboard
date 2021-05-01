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

exports.getflavors = function (token, region) {
    return new Promise(function (resolve, reject) {
        flavor.getflavors(token, region).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.getservers = function (token, region) {
    return new Promise(function (resolve, reject) {
        server.getservers(token, region).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.getserverdetail = function (token, serverid, region) {
    return new Promise(function (resolve, reject) {
        server.getserverdetail(token, serverid, region).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.deleteinstance = function (token, serverid, region) {
    return new Promise(function (resolve, reject) {
        server.deleteinstance(token, serverid, region).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.getquotas = function (token, projectid, region) {
    return new Promise(function (resolve, reject) {
        quota.getquotas(token, projectid, region).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.getimages = function (token, region) {
    return new Promise(function (resolve, reject) {
        image.getimage(token, region).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.createinstance = function (token, name, image, image_text, flavor, password, region) {
    return new Promise(function (resolve, reject) {
        server.createinstance(token, name, image, image_text, flavor, password, region).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}

exports.bootinstance = function (token, instanceId, region) {
    return new Promise(function (resolve, reject) {
        server.bootinstance(token, instanceId, region).then(function (body) {
            resolve(body);
        }).catch(function (error) {
            reject(error);
        });
    })
}