const User = require('../data_models/user');

exports.getUsers = function(req, res, next) {
    User.find({activeUser: true}).exec((err, users) => {
        if (err) return next(err);
        res.json(users);
    });
};

exports.getUser = function(req, res, next) {
    User.findById({_id: req.params._id}).exec((err, user) => {
        if (err) return next(err); //todo handle errors better
        res.json(user);
    });
};

exports.updateUser = function(req, res, next) {
    const newValue = req.params.newValue;
    let updateObject = {};

    switch (req.params.attribute) {
        case 'firstName':
            updateObject = {'profile.firstName': newValue};
            break;
        case 'lastName':
            updateObject = {'profile.lastName': newValue};
            break;
        case 'activeUser':
            updateObject = {'activeUser': newValue};
            break;
        default:
            res.send('Please enter a real attribute to update');
    }

    User.findByIdAndUpdate({_id: req.params._id}, updateObject, {new: true, upsert: false}).exec((err, user) => {
        if (err) return next(err); //todo handle errors better
        res.json(user);
    });
};

exports.activateUser = function(req, res, next) {
    User.findOneAndUpdate({email: req.params.email}, {activeUser: req.params.newValue}, {new: true, upsert: false})
        .exec((err, updatedUser) => {
            if (err) return next(err); //todo handle errors better
            res.json(updatedUser);
        })
};

exports.deleteUser = function(req, res, next) {
    User.findByIdAndRemove({_id: req.params._id}).exec((err, user) => {
        if (err) return next(err); //todo handle errors better
        res.json(
            {
                message: 'The user was successfully deleted',
                id: user._id
            });
    });
};