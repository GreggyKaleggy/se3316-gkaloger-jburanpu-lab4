//Code from: https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/ 

const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = async function (req, res, next) {
    //Get token from header
    token = req.header('x-auth-token');

    //Check if no token, return 401
    if (!token) {
        return res.status(401).json({ msg: 'Authorization denied' });
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.user;
        res.locals.user = decoded.user;
        await next();
    }
    catch (err) {
        res.status(401).json({ msg: 'Invalid token' })
    }
};