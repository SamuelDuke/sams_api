const jwt = require('jsonwebtoken');

const User = require('../data_models/user');
const config = require('../config/main');


function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: 604800 // in seconds todo research what other options are available
    });
}

exports.register = ((req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    let resStatus;
    let msg;
    let token;
    let userInfo;

    // Error handling to ensure you get the info you need
    if (!email) {
        resStatus = 422;
        msg = 'You must enter your email address';
    }
    if (!firstName || !lastName) {
        resStatus = 422;
        msg = 'You must enter your full name';
    }
    if (!password) {
        resStatus = 422;
        msg = 'You must enter your password';
    }

    User.findOne({ email }, (err, existingUser) => {
        if (err) return next(err);

        if (existingUser) {
            resStatus = 422;
            msg = 'That email address is already in use.';

            res.status(resStatus).json({msg: msg, token: token, user: userInfo});
        }
    });

    const user = new User({
        email, password, profile: {firstName, lastName}
    });

    user.save((err, user) => {
        if (err) {return next(err);}

        const userInfo = User.infoToSend(user);

        resStatus = 201;
        msg = 'The user was saved to the database.';

        res.status(resStatus).json({
            msg: msg,
            // todo need to make the token auth
            token: `JWT ${generateToken(userInfo)}`,
            user: userInfo
        });
    });
});

exports.login = ((req, res, next) => {
    const userInfo = User.infoToSend(req.user);
    res.status(200).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
    });
});