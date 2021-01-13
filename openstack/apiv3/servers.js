var request = require('request');
require('dotenv').config();

exports.getservers = function (token) {
    return new Promise(function (resolve, reject) {
        var options = {
            uri: process.env.COMPUTE_API_URL + "/servers",
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