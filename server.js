const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const config = require('./config/main');
const apiRouter = require('./apiRouter');

const app = express();

// Connect mongoose to handle promises
mongoose.Promise = global.Promise;

// Database Setup
mongoose.connect(config.database);

// Setup middleware for all Express requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Start the server
let server = app.listen(config.port);
console.log('The server is listening at port 8080.');

// Set up the Router
apiRouter(app);