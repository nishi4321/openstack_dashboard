require('dotenv').config();

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
app.set("superSecret", process.env.SUPER_SECRET);
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
        var jwttoken = jwt.sign({ username: username, token: result.token, projectid: result.projectid }, app.get("superSecret"), { expiresIn: "24h" });
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
    var token = req.body.token || req.query.token;
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
        req.decoded = decoded;
        next();
    });
});

/**
 * overview page.
 */
app.get('/dashboard', function (req, res) {
    res.render("dashboard", {});
});

/**
 * instances page.
 */
app.get('/instances', function (req, res) {
    res.render("instances", {});
});

/**
 * Get instance list.
 */
app.get("/api/getinstances", function (req, res, next) {
    openstackapi.getservers(req.decoded.token).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get server list." })
    })
});

/**
 * Get instance detail.
 */
app.post("/api/getinstancedetail", function (req, res, next) {
    openstackapi.getserverdetail(req.decoded.token, req.body.serverid).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get server list." })
    })
});

/**
 * Get instance detail.
 */
app.post("/api/deleteinstance", function (req, res, next) {
    openstackapi.deleteinstance(req.decoded.token, req.body.serverid).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get server list." })
    })
});

/**
 * Create instance.
 */
app.post("/api/createinstance", function (req, res, next) {
    openstackapi.createinstance(req.decoded.token, req.body.name, req.body.image, req.body.flavor, req.body.password).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function (error) {
        res.json({ success: false, msg: error })
    })
});

/**
 * Get flavor list.
 */
app.get("/api/getflavors", function (req, res, next) {
    openstackapi.getflavors(req.decoded.token).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get flavor list." })
    })
});

/**
 * Get image list.
 */
app.get("/api/getimages", function (req, res, next) {
    openstackapi.getimages(req.decoded.token).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get image list." })
    })
});

/**
 * Get quota.
 */
app.get("/api/getquotas", function (req, res, next) {
    openstackapi.getquotas(req.decoded.token, req.decoded.projectid).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get quota." })
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