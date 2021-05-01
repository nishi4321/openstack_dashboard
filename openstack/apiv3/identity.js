var request = require('request');
require('dotenv').config();

var fs = require('fs');
const msg = fs.readFileSync("config.json", { encoding: "utf-8" });
var config = JSON.parse(msg).Credentials;

exports.auth = function (username, password) {
    return new Promise(function (resolve, reject) {
        var resultJson = [];
        var count = 0;
        for (i = 0; i < config.length; i++) {
            login(username, password, config[i]).then(function (result) {
                resultJson.push({ region: result.region, result: result });
                count++
                if (count == config.length) {
                    resolve(resultJson);
                }
            }).catch(function (error) {
                reject(error);
            });
        }
    })
}

function login(username, password, regionConfig) {
    return new Promise(function (resolve, reject) {
        var options = {
            uri: regionConfig.OS_AUTH_URL + "/v3/auth/tokens?nocatalog",
            headers: {
                "Content-Type": "application/json",
            },
            json: {
                "auth": {
                    "identity": {
                        "methods": ["password"],
                        "password": {
                            "user": {
                                "domain": {
                                    "name": regionConfig.OS_USER_DOMAIN_NAME
                                },
                                "name": username,
                                "password": password
                            }
                        }
                    },
                    "scope": {
                        "project": {
                            "domain": {
                                "name": regionConfig.OS_PROJECT_DOMAIN_NAME
                            },
                            "name": regionConfig.OS_PROJECT_NAME
                        }
                    }
                }
            }
        };
        request.post(options, function (error, response, body) {
            if (error || response.statusCode != 201) {
                reject("error")
            } else {
                // Return to token.
                resolve({ token: response.caseless.dict["x-subject-token"], projectid: body.token.project.id, region: regionConfig.REGION_NAME })
            }
        });
    })
}