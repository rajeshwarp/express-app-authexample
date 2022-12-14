//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
//const encrypt = require('mongoose-encryption') we will see hashing
//var md5 = require('md5')
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get('/', function (req, res) {
    res.render("home")
})

app.get('/register', function (req, res) {
    res.render("register")
})

app.get('/login', function (req, res) {
    res.render("login")
})

// register a user 
app.post('/register', function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
        newUser.save(function (err) {
            if (!err) {
                res.render("secrets")
            } else {
                res.render(err)
            }
        });
    });


})

// User login Level one database authentication 
app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, userResult) {
        if (err) {
            res.render(err + " >>invalid user name or password");
        } else {
            if (userResult) {
                bcrypt.compare(password, userResult.password, function (err, result) {
                    if (result == true) {
                        res.render("secrets")
                    }
                    else {
                        res.render(err + " >>invalid user name or password");
                    }
                });
            } else {
                res.render(err + " >>invalid user name or password");
            }
        }
    })
})


// Database 
mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true
});
//---------VV-------------
const userSchema = {
    email: String,
    password: String
};
//---------VV----- .env file--------

//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

//Starting the App
app.listen(3000, function () {
    console.log("Server started on port 3000");
});