var request = require('request');
require('dotenv').config();

var fs = require('fs');
const msg = fs.readFileSync("config.json", { encoding: "utf-8" });
var config = JSON.parse(msg).Credentials;

exports.getservers = function (token, region) {
    return new Promise(function (resolve, reject) {
        var COMPUTE_API_URL;
        for (i = 0; i < config.length; i++) {
            if (region == config[i].REGION_NAME) {
                COMPUTE_API_URL = config[i].COMPUTE_API_URL;
                break;
            }
        }
        var options = {
            uri: COMPUTE_API_URL + "/servers/detail",
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

exports.getserverdetail = function (token, serverid, region) {
    return new Promise(function (resolve, reject) {
        var COMPUTE_API_URL;
        for (i = 0; i < config.length; i++) {
            if (region == config[i].REGION_NAME) {
                COMPUTE_API_URL = config[i].COMPUTE_API_URL;
                break;
            }
        }
        var options = {
            uri: COMPUTE_API_URL + "/servers/" + serverid,
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

exports.deleteinstance = function (token, serverid, region) {
    return new Promise(function (resolve, reject) {
        var COMPUTE_API_URL;
        for (i = 0; i < config.length; i++) {
            if (region == config[i].REGION_NAME) {
                COMPUTE_API_URL = config[i].COMPUTE_API_URL;
                break;
            }
        }
        var options = {
            uri: COMPUTE_API_URL + "/servers/" + serverid,
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

exports.createinstance = function (token, name, image, image_text, flavor, password, region, network) {
    return new Promise(function (resolve, reject) {
        // 
        var COMPUTE_API_URL;
        for (i = 0; i < config.length; i++) {
            if (region == config[i].REGION_NAME) {
                COMPUTE_API_URL = config[i].COMPUTE_API_URL;
                break;
            }
        }
        var options = {};
        if (image_text.includes("windows")) {
            // Windows instance with Cloudbase-Init
            var user_data = "#ps1_sysnative\nRename-Computer -NewName \""+name+"\" -Force -Restart";
            var buffer = new Buffer(user_data);
            var string = buffer.toString('base64');
            // 
            options = {
                uri: COMPUTE_API_URL + "/servers",
                headers: {
                    "Content-Type": "application/json",
                    "X-Auth-Token": token,
                },
                json: {
                    "server": {
                        "name": name,
                        "imageRef": image,
                        "flavorRef": flavor,
                        "metadata" : {
                            "admin_pass": password
                        },
                        "OS-DCF:diskConfig": "AUTO",
                        "security_groups": [
                            {
                                "name": "default"
                            }
                        ],
                        "user_data": string,
                        "networks" : [{
                            "uuid" : network
                        }]
                    }
                }
            };
        } else {
            // Linux instance with Cloud-Init
            var cloud_init = "#cloud-config\n"
            cloud_init += "password: " + password + "\n"
            cloud_init += "chpasswd: { expire: False }\n"
            cloud_init += "ssh_pwauth: True\n";
            cloud_init += "apt:\n";
            cloud_init += "  apt_preserve_sources_list: false\n";
            cloud_init += "  primary:\n";
            cloud_init += "    - arches:\n";
            cloud_init += "      - amd64\n";
            cloud_init += "      uri: \""+config.UBUNTU_MIRROR_URL+"\"\n";
            cloud_init += "  security:\n";
            cloud_init += "    - arches:\n";
            cloud_init += "      - amd64\n";
            cloud_init += "      uri: \"http://security.ubuntu.com/ubuntu\"\n";
            var buffer = new Buffer(cloud_init);
            var string = buffer.toString('base64');
            //
            options = {
                uri: COMPUTE_API_URL + "/servers",
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
                        "user_data": string,
                        "networks" : [{
                            "uuid" : network
                        }]
                    }
                }
            };
        }
        request.post(options, function (error, response, body) {
            if (error || response.statusCode != 202) {
                reject(body)
            } else {
                resolve(body)
            }
        });
    })
}

exports.bootinstance = function (token, instanceId, region) {
    return new Promise(function (resolve, reject) {
        // 
        var COMPUTE_API_URL;
        for (i = 0; i < config.length; i++) {
            if (region == config[i].REGION_NAME) {
                COMPUTE_API_URL = config[i].COMPUTE_API_URL;
                break;
            }
        }
        var options = {
            uri: COMPUTE_API_URL + "/servers/" + instanceId + "/action",
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": token,
            },
            json: {
                "os-start": null
            }
        };
        request.post(options, function (error, response, body) {
            if (error || response.statusCode != 202) {
                reject(body)
            } else {
                resolve(body)
            }
        });
    })
}