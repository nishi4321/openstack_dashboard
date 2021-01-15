var request = require('request');
require('dotenv').config();

exports.getservers = function (token) {
    return new Promise(function (resolve, reject) {
        var options = {
            uri: process.env.COMPUTE_API_URL + "/servers/detail",
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": token,
            }
        };
        request.get(options, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                // Return to body.
                resolve(body)
            }
        });
    })
}

exports.getserverdetail = function (token, serverid) {
    return new Promise(function (resolve, reject) {
        var options = {
            uri: process.env.COMPUTE_API_URL + "/servers/" + serverid,
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": token,
            }
        };
        request.get(options, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                // Return to body.
                resolve(body)
            }
        });
    })
}

exports.deleteinstance = function (token, serverid) {
    return new Promise(function (resolve, reject) {
        var options = {
            uri: process.env.COMPUTE_API_URL + "/servers/" + serverid,
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": token,
            }
        };
        request.delete(options, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                // Return to body.
                resolve({ msg: "success" });
            }
        });
    })
}

exports.createinstance = function (token, name, image, flavor, password) {
    return new Promise(function (resolve, reject) {
        // 
        var cloud_init = "#cloud-config\n"
        cloud_init += "password: " + password + "\n"
        cloud_init += "chpasswd: { expire: False }\n"
        cloud_init += "ssh_pwauth: True";
        var buffer = new Buffer(cloud_init);
        var string = buffer.toString('base64');
        // 
        var options = {
            uri: process.env.COMPUTE_API_URL + "/servers",
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": token,
            },
            json: {
                "server": {
                    "name": name,
                    "imageRef": image,
                    "flavorRef": flavor,
                    "OS-DCF:diskConfig": "AUTO",
                    "security_groups": [
                        {
                            "name": "default"
                        }
                    ],
                    "user_data": string
                }
            }
        };
        request.post(options, function (error, response, body) {
            if (error || response.statusCode != 202) {
                reject("error")
            } else {
                resolve(body)
            }
        });
    })
}