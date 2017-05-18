const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const User = require('../data_models/user');
const config = require('./main');

// Setting username field to email rather than username
const localOptions = {usernameField: 'email'};

// Setting up local strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
        if (err) { return done(err);}
        if(!user) {return done(null, false, {error: 'The username or password can not be verified. Please try again.'});}

        user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err);}
            if(!isMatch) {return done(null, false, {error: 'The username or password can not be verified. Please try again.'});}

            return done(null, user);
        });
    });
});

// Setting up Jwt strategy options
const jwtOptions = {
    // Telling Passport to check authorization headers for Jwt
    // todo research other ways to store the Jwt
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
};

// Setting up the JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload._id, (err, user) => {
        if (err) { return done(err, false);}
        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);