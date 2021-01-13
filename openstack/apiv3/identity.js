var request = require('request');
require('dotenv').config();

exports.auth = function (username, password) {
    return new Promise(function (resolve, reject) {
        var options = {
            uri: process.env.OS_AUTH_URL + "/v3/auth/tokens?nocatalog",
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
                                    "name": process.env.OS_USER_DOMAIN_NAME
                                },
                                "name": username,
                                "password": password
                            }
                        }
                    },
                    "scope": {
                        "project": {
                            "domain": {
                                "name": process.env.OS_PROJECT_DOMAIN_NAME
                            },
                            "name": process.env.OS_PROJECT_NAME
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
                resolve(response.caseless.dict["x-subject-token"])
            }
        });
    })
}