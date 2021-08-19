const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.checkToken = function(req, res, next) {
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    }
    else {
        res.status(403).send('Token not provided');
    }
};

exports.verifyToken = function(req, res, next) {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizeData) => {
        if(err){
            console.log('Could not connect');
            res.status(403).send('Could not connect');
        }
        else {
            res.json({
                message: 'Successful log in',
                authorizeData
            });
            console.log('Success');
        }
    });
};

exports.login_post = function(req, res, next){
    User.findOne({
        username: req.body.username
      })
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
    
          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
    
          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );
    
          if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
          }
    
          var token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
            expiresIn: 86400
          });
    
          res.status(200).send(token);
        });
};


exports.signup_post = [

    body('firstName', 'First name is required').trim().isLength({min: 1}).escape(),
    body('lastName', 'Last name is required').trim().isLength({min: 1}).escape(),
    body('username', 'Username is required').trim().isLength({min: 1}).escape(),
    body('password', 'Password does not meet criteria').trim().isLength({min: 8}).escape(),
    async(req, res, next) => {
      const errors = validationResult(req).array();
  
      const passwordMeetsCriteria = req.body.password.length >= 8
  
      const fieldsUnfilled = !passwordMeetsCriteria || !req.body.firstName || !req.body.lastName|| !req.body.username|| !req.body.password|| !req.body.confirmPassword
      if (fieldsUnfilled) {
        res.render('sign-up', 
          {
            title: "Create account", 
            errors,
            fields: {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              username: req.body.username.toLowerCase()
            }
          });
          console.log('unfilled');
      } else {
        const usernameExists = await User.findOne({username: req.body.username}).exec();
        const passwordsMatch = req.body.password === req.body.confirmPassword;
      
        if (usernameExists) {
          errors.push({msg: "Username already exists"});
          console.log('username exists')
        } 
        if (!passwordsMatch) {
          errors.push({msg: "Passwords do not match"});
          console.log('passwords do not match')
        }
        if (!usernameExists & passwordsMatch) {
    
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    
            if (err) return next(err)
    
            const newUser = new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              username: req.body.username.toLowerCase(),
              password: hashedPassword
            })
        
            newUser.save( (err, user) => {
              if (err) {
                console.log('user save problem');
                return next(err);
              }
              res.redirect('/')
            })
          })
    
        }
        else {
          res.render('sign-up', 
          {
            title: "Create account",
            errors,
            fields: {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              username: req.body.username.toLowerCase()
            }
          });
          console.log('pata nhi');
        }
      }
  
    }
  ]