const express = require('express');
//ToDo add authentication
const passport = require('passport');
const passportService = require('./config/passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

// =============================================================================
// Import Controllers
// =============================================================================
const BaseController = require('./controllers/base');
const AuthController = require('./controllers/authentication');
const UserController = require('./controllers/user');


// =============================================================================
// Exports
// =============================================================================
module.exports = (app) => {
    // Initializing route groups
    const apiRoutes = express.Router();
    const authRoutes = express.Router();
    const userRoutes = express.Router();

    // Link the different routes
    apiRoutes.use('/auth', authRoutes);
    apiRoutes.use('/users', userRoutes);

    // set up routes
    apiRoutes.get('/', BaseController.baseRoute);

    // ================================
    // Auth Routes
    // ================================
    authRoutes.post('/register', AuthController.register);
    authRoutes.post('/login', requireLogin, AuthController.login);
    // todo authRoutes.post('/forgot-password', AuthController.forgotPassword);
    // todo authRoutes.post('/reset-password/:token', AuthController.verifyToken);


    // ================================
    // User Routes
    // ================================

    // get all users
    userRoutes.get('/', requireAuth, UserController.getUsers);

    // get specific user
    userRoutes.get('/:_id', requireAuth, UserController.getUser);

    // Attributes that can be updated [firstName, lastName, activeUser]
    userRoutes.patch('/update/:_id/:attribute/:newValue', requireAuth, UserController.updateUser);

    // Activate or deactivate user with email
    userRoutes.patch('/activate/:email/:newValue', UserController.activateUser);

    // Delete user
    userRoutes.delete('/:_id', UserController.deleteUser);


    app.use('/api', apiRoutes);
};
