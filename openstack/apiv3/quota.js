var request = require('request');
require('dotenv').config();

exports.getquotas = function (token, projectid) {
    return new Promise(function (resolve, reject) {
        var options = {
            uri: process.env.COMPUTE_API_URL + "/os-quota-sets/" + projectid + "/detail",
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