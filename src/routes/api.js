const express = require('express');
const route = express.Router();
const refreshRoute = require('./refresh-token');

route.use('/refreshToken', refreshRoute);
module.exports = route;
