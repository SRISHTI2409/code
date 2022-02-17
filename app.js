const express = require('express');
const app = express();
const mongoose = require('mongoose')
const User = require('./models/hello')
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var crypto = require('crypto-js');
var key = "password";
//
const jwt = require('jsonwebtoken')
jwtKey = "jwt"
//
mongoose.connect('mongodb+srv://srishti:2409@cluster0.bhx2a.mongodb.net/tutorial?retryWrites=true&w=majority')
    .then(() => {
        console.warn("connected");
    })
app.post('/register', jsonParser, function (req, res) {
    console.log(req.body.password)
    const ciphertext = crypto.AES.encrypt(req.body.password, key).toString();


    // console.log(originalText)
    // console.log(bytes)

    //var encrypted = cipher.update(req.body.password,
    //'utf8', 'hex');

    console.warn(req.body.encrypted)
    const data = new User({
        _id: mongoose.Types.ObjectId(),
        name: req.body.password,
        email: req.body.email,
        address: req.body.address,
        password: ciphertext,
    })

    data.save().then((result) => {
        res.json("user saved")
        // res.json(result)
    })
        .catch((err) => console.warn(err))
    //res.end("hello");

})

//app.get("/", function (req, res) {
//  res.end("hello");

//})

app.post('/login', jsonParser, function (req, res) {
    const userSentPw = req.body.password;
    console.log(userSentPw);
    User.findOne({ email: req.body.email }).then((data) => {
        console.log(data.password);
        var bytes = crypto.AES.decrypt(data.password, key);
        var originalText = bytes.toString(crypto.enc.Utf8);
        console.warn("decrypted", originalText);
        if (originalText == userSentPw) {
            jwt.sign({ data }, jwtKey, { expiresIn: '300s' }, (err, token) => {
                res.status(201).json({ token })
            })
        } else {
            res.json({ "message": "Your pw is wrong" })
        }


    })

})
app.get('/hello', verifyToken, function (req, res) {
    User.find().then((result) => {
        res.status(200).json(result)

    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];



    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        console.warn(bearer[1])
        req.token = bearer[1]

        jwt.verify(req.token, jwtKey, (err, authData) => {
            if (err) {
                res.json({ result: err })
            }
            else {
                next();
            }
        })
        //res.send("hello")
    }
    else {
        res.send({ "result": "token not provied" })
    }
}
app.listen(7000);