const express = require('express');
const route = express.Router();
const refreshRoute = require('./refresh-token');

const configuredRefreshTokenRoute = refreshRoute();

route.use('/refreshToken', configuredRefreshTokenRoute);
module.exports = route;
