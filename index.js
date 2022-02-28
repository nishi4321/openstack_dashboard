require('dotenv').config();

var fs = require('fs');
const msg = fs.readFileSync("config.json", { encoding: "utf-8" });
var config = JSON.parse(msg);
var regions = [];

var cre_configs = config.Credentials;
for (i = 0; i < cre_configs.length; i++) {
    regions.push(cre_configs[i].REGION_NAME)
}

const openstackapi = require("./openstack/apiv3/index")

var express = require("express");
var bodyParser = require('body-parser')
var jwt = require("jsonwebtoken");
var app = express();

var server = app.listen(3000, function () {
    console.log("Node.js is listening to PORT:" + server.address().port);
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("superSecret", config.SUPER_SECRET);
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', function (req, res) {
    res.render("index", {});
});

app.get('/login', function (req, res) {
    res.render("login", {});
});

/**
 * Login
 */
app.post('/api/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    openstackapi.identity(username, password).then(function (result) {
        // OK
        var jwttoken = jwt.sign({ username: username, credentials: result }, app.get("superSecret"), { expiresIn: "24h" });
        res.json({ success: true, jwttoken: jwttoken })
    }).catch(function (error) {
        // Bad
        res.json({ success: false });
    })
})

/**
 * Authentication
 */
app.use((req, res, next) => {
    var token = '';
    if(req.headers.cookie != undefined && req.headers.cookie.split('token=')[1] != undefined) {
        token = req.headers.cookie.split('token=')[1].split(';')[0];
    }else {
        return res.status(403).send({
            success: false,
            msg: "No token provided"
        });
    }
    if (!token) {
        return res.status(403).send({
            success: false,
            msg: "No token provided"
        });
    }
    jwt.verify(token, app.get("superSecret"), (err, decoded) => {
        if (err) {
            return res.json({
                success: false,
                msg: "Invalid token"
            });
        }
        req.decoded = { username: decoded.username };
        for (i = 0; i < decoded.credentials.length; i++) {
            if (req.query.region == decoded.credentials[i].region) {
                req.decoded = { username: decoded.username, token: decoded.credentials[i].result.token, projectid: decoded.credentials[i].result.projectid };
            }
        }
        next();
    });
});

/**
 * overview page.
 */
app.get('/dashboard', function (req, res) {
    res.render("dashboard", { USERNAME: req.decoded.username, Regions: regions });
});

/**
 * instances page.
 */
app.get('/instances', function (req, res) {
    res.render("instances", { USERNAME: req.decoded.username, Regions: regions });
});

/**
 * Get instance list.
 */
app.get("/api/getinstances", function (req, res, next) {
    openstackapi.getservers(req.decoded.token, req.query.region).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get server list." })
    })
});

/**
 * Get instance detail.
 */
app.post("/api/getinstancedetail", function (req, res, next) {
    openstackapi.getserverdetail(req.decoded.token, req.body.serverid, req.query.region).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get server list." })
    })
});

/**
 * Get instance detail.
 */
app.post("/api/deleteinstance", function (req, res, next) {
    openstackapi.deleteinstance(req.decoded.token, req.body.serverid, req.query.region).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get server list." })
    })
});

/**
 * Create instance.
 */
app.post("/api/createinstance", function (req, res, next) {
    if((req.body.name).includes(" ")) {
        res.json({success: false, msg: {"error": { message: "Cannot use space in \"Name\""}}})
        return;
    }
    openstackapi.createinstance(req.decoded.token, req.body.name, req.body.image, req.body.os_text, req.body.flavor, req.body.password, req.query.region, req.body.network).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function (error) {
        res.json({ success: false, msg: error })
    })
});

/**
 * Boot instance.
 */
app.post("/api/bootinstance", function (req, res, next) {
    openstackapi.bootinstance(req.decoded.token, req.body.instanceId, req.query.region).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function (error) {
        res.json({ success: false, msg: error })
    })
});

/**
 * Get flavor list.
 */
app.get("/api/getflavors", function (req, res, next) {
    openstackapi.getflavors(req.decoded.token, req.query.region).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get flavor list." })
    })
});

/**
 * Get image list.
 */
app.get("/api/getimages", function (req, res, next) {
    openstackapi.getimages(req.decoded.token, req.query.region).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get image list." })
    })
});

/**
 * Get quota.
 */
app.get("/api/getquotas", function (req, res, next) {
    openstackapi.getquotas(req.decoded.token, req.decoded.projectid, req.query.region).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get quota." })
    })
});

/**
 * Get networks.
 */
app.get("/api/getnetworks", function (req, res, next) {
    openstackapi.getnetworks(req.decoded.token, req.query.region).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get network." })
    })
});

/*
* get sample
*/
/*
app.get("/api/photo/list", function(req, res, next){
    res.json(photoList);
});
*/

/*
* post sample
*/
/*
app.post('/', function(req, res) {
    res.send('POST is sended.');
})
*/