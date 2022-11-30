const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../schema/userSchema');
const auth = require('../authFunction');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('../config')
router.use(express.json())

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user.deactivated) {
            return res.status(400).json({ errors: [{ msg: 'Account is deactivated' }] })
        }

        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//login process
router.post('/login', [
    check('email', 'Please include valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Email does not exist' }] });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Wrong password ya fool' }] });
        }
        if (user.deactivated) {
            return res.status(400).json({ errors: [{ msg: 'Account is deactivated please contact an admin' }] })
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.jwtSecret, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        })
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = { router };