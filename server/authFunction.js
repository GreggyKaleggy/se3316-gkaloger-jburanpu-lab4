const jwt = require('jsonwebtoken');
const config = require('./config')

module.exports = async function (req, res, next) {
    token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'Authorization denied' });
    }

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