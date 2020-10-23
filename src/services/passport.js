'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { user: User } = require('./../database/models');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use('JwtStrategy', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: false
}, (req, email, password, done) => {
  const { googleId } = req.body;

  switch (true) {
    case !!googleId:
      User.findOne({
        where: { googleId },
        include: ['role']
      }).then(user => {
        if (!user) return done(null, false, { message: 'User not found' });
        return done(null, user);
      }).catch(error => done(error));
      break;
  }
}));

passport.use('GoogleStrategy', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.APP_BACKEND_URL + '/api/login/google/callback'
}, (access, refresh, { _json }, done) => {
    const { name, email, sub: googleId } = _json;

    User.findOrCreate({
      where: { googleId },
      defaults: { googleId, name, email, roleId: 1 }
    }).then(([user, absent]) => {
      return done(null, { ...user.get() });
    }).catch(error => done(error));
  }
));

module.exports = {
  passport
};
