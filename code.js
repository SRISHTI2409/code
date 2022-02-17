
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/users')
var bodyPraser = require('body-parser')
var jsonParser = bodyPraser.json();
mongoose.connect("mongodb+srv://srishti:2409@cluster0.bhx2a.mongodb.net/tutorial?retryWrites=true&w=majority"
);
//.then(() => {
//  console.warn("connected with db");
//
//})

//User.find({},function(err,users){
// if(err)consolele.warn(err);
//  console.warn(users);
//})

//const data = new User({
//  _id : new mongoose.Types.ObjectId(),
//name:"dollu",
//email:'dollu@test.com',
//address:'India'

//});
//data.save().then((result)=>{
//  console.warn(result)

//})

//.catch(err => console.warn(err))

//GET API

app.get('/users', function (req, res) {

  User.find().then((data) => {
    res.status(201).json(data)
  })
})

app.post('/user', jsonParser, function (req, res) {
  const data = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    address: req.body.address
  })
  data.save().then((result) => {
    res.status(201).json(result)

  })
    //res.end(req.body.name)
    //res.end("Hello api will be here")

    .catch((error) => console.warn(error)
    )
})
app.delete('/user/:id', function (req, res) {
  User.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json(result)
  }).catch((err) => { console.warn(err) })
})

app.put('/user/:id', jsonParser, function (req, res) {
  User.updateOne({ _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address

      }
    }
  ).then((result) => {
    res.status(200).json(result)
  }).catch((err) => { console.warn(err) })
})

app.get("/search/:name",function(req,res){
  var regex = new RegExp(req.params.name,'i');
  User.find({name:regex}).then((result)=>{
    res.status(200).json(result)
  })
})
app.listen(9500)




