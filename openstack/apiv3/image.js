var request = require('request');
require('dotenv').config();

var fs = require('fs');
const msg = fs.readFileSync("config.json", { encoding: "utf-8" });
var config = JSON.parse(msg).Credentials;

exports.getimage = function (token, region) {
    return new Promise(function (resolve, reject) {
        var IMAGE_API_URL;
        for(i = 0; i < config.length; i++) {
            if(region == config[i].REGION_NAME) {
                IMAGE_API_URL = config[i].IMAGE_API_URL;
                break;
            }
        }
        var options = {
            uri: IMAGE_API_URL + "/v2/images",
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