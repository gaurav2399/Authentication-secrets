//jshint esversion:6

require('dotenv').config();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model('User', userSchema);

app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.get('/logout', function(req, res){
  res.redirect('/');
})

app.post('/login', function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password === password){
          res.render('secrets');
        }else{
          res.send("Wrong Password!!");
        }
      }else{
        console.log('There is no user with this username');
      }
    }else{
      res.send("Error while logging in...");
    }
  })
});

app.post('/register', function(req, res){
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });

  user.save(function(err){
    if(!err){
      res.render('secrets');
    }else{
      res.send('Error while registering');
    }
  });

})

app.listen(3000, function(){
  console.log('server started listening on port 3000');
});
