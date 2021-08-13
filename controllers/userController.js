const User = require('../models/user');
const { body, valdationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');

exports.login_post = function(req, res, next){
  passport.authenticate('local', { session: false, successRedirect: '/', failureRedirect: '/bla' }, (err, user, info) => {
      if (err || !user) {
          return res.status(400).json({ 
              message: 'Something went wrong',
              user 
          });
      }
      req.login(user, { session: false }, (error) => {
          if (error) res.send(error);

          const token = jwt.sign({ user }, process.env.JWT_SECRET, {
              expiresIn: '1d',
          });
          let data = { _id: user._id, username: user.username};
          return res.json({ user: data, token });
      });
  })(req, res);
};

exports.logout_post = function(req, res, next) {
  return res.json('Received a POST HTTP method');
};

exports.signup_post = [
  body('username').trim().isLength({ min: 1 }).escape().withMessage('Username must be specified')
  .isAlphanumeric().withMessage('Username has non-alphanumeric characters'),
  body("password").isLength({ min: 6 }).withMessage("Password must contain at least 6 characters"),

  async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          return res.json({
              username: req.body.username,
              errors: errors.array(),
          });
      }
      else {
          await User.findOne({ 'username': req.body.username })
              .exec(function(err, found_username) {

                  if (found_username) {
                      return next(err);
                  } 

                  else if (err) { return next(err); }
                  
                  else {
                      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                          if (err) { 
                              return next(err);
                          };
                          const user = new User({
                              username: req.body.username,
                              password: hashedPassword,
                              admin: false,
                          }).save(err => {
                              if (err) { 
                                  return next(err);
                              };
                              res.status(200).json({
                                  message: "Signed up successfully",
                                  user: req.user,
                              });
                          });
                      });
                  }
          })
      }
  }
];