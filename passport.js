const LocalStrategy = require('passport-local');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = {
  passportAuthentication: new LocalStrategy( (username, password, done) => {
      User.findOne({username: username}, (err, user) => {
          if (err) {
              return done(err)
          }
          if (!user) {
              return done(null, false, {message: "Username does not exist"})
          }
          bcrypt.compare(password, user.password, (err, res) => {
              if(res){
                return done(null, user);
              } else {
                return done(null, false, {message: 'Incorrect Password'});
              }
          });
          return done(null, user);
      });
      
  }),

  serialize: (user, done) => {
      done(null, user.id)
  },

  deserialize: (id, done) => {
      User.findById(id, (err, user) => {
          done(err, user)
      })
  },

  jwtStrategy: new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  function(jwtPayload, cb) {
    return User.findOneById(jwtPayload.id)
      .then(user => {
        return cb(null, user);
      })
      .catch(err => {
        return cb(err);
      });
    })
}