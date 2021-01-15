var request = require('request');
require('dotenv').config();

exports.getimage = function (token) {
    return new Promise(function (resolve, reject) {
        var options = {
            uri: process.env.IMAGE_API_URL + "/v2/images",
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