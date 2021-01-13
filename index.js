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
    openstackapi.identity(username, password).then(function (token) {
        // OK
        var jwttoken = jwt.sign({ username: username, token: token }, app.get("superSecret"), { expiresIn: "24h" });
        res.json({ success: true, jwttoken })
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
    // tokenがない場合、アクセスを拒否
    if (!token) {
        return res.status(403).send({
            success: false,
            msg: "No token provided"
        });
    }
    // tokenが改ざんされていないかチェック
    jwt.verify(token, app.get("superSecret"), (err, decoded) => {
        // tokenが不正なものだった場合、アクセス拒否
        if (err) {
            return res.json({
                success: false,
                msg: "Invalid token"
            });
        }
        // 正しいtokenの場合、認証OKする
        req.decoded = decoded;
        next();
    });
});

/**
 * Login page.
 */
app.get('/dashboard', function (req, res) {
    res.render("dashboard", {});
});

/**
 * Get server list.
 */
app.get("/api/getservers", function (req, res, next) {
    openstackapi.getservers(req.decoded.token).then(function (result) {
        res.json({ success: true, body: result });
    }).catch(function () {
        res.json({ success: false, msg: "Failed to get server list." })
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