const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {type: String, lowercase: true, unique: true, require: true},
    password: {type: String, require: true},
    role: {type: String, enum: ['Admin', 'Member'], default: 'Member'},
    activeUser: {type: Boolean, default: true},
    profile: {
        firstName: {type: String},
        lastName: {type: String}
    },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}
});

UserSchema.pre('save', function (next) {
    const user = this;
    const SALT_FACTOR = 5; //todo figure out what this does! https://www.npmjs.com/package/bcrypt-nodejs

    // Check to see if the password is modified
    if(!user.isModified('password')) return next();

    // Generate the salt for the hash
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err);
        // Hash the password and salt together
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            // Replace the plain text password with the hash
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err){return cb(err);}
        cb(null, isMatch);
    });
};

UserSchema.statics.infoToSend = (user) => {
    return {
        _id: user._id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        role: user.role
    };
};

module.exports = mongoose.model('User', UserSchema);