const express = require('express');
const router = express.Router();
router.use(express.json());
const List = require('../schema/userSchema');
const { db } = require('../schema/userSchema');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const userSchema = require('../schema/userSchema');
const auth = require('../authFunction');

//Get all users
router.get('/', async (req, res) => {
    try {
        const user = await User.find()
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/new', [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter valid password').isLength({ min: 6, max: 30 }).trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {
        const { name, email, password } = req.body;
        let emailname = await User.findOne({ email });
        if (emailname) {
            return res.status(400).json({ errors: [{ msg: 'Email address is already associated with an account' }] });
        }
        if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(name)) {
            return res.status(400).json({ errors: [{ msg: 'Name should not contain any numbers or special characters' }] });
        }
        user = new User({
            name,
            email,
            password
        });
        let error = user.validateSync();
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save()
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.jwtSecret, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        }
        );
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/changepassword', [
    check('password', 'Please enter valid password').isLength({ min: 6, max: 30 }).trim().escape()
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {
        const { email, password } = req.body;
        let emailCheck = await User.findOne({ email });
        if (!emailCheck) {
            return res.status(400).json({ errors: [{ msg: 'Email address is not associated with any account' }] });
        }
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        const user = await User.findOneAndUpdate({ email: email }, { $set: { password: newPassword } }, { new: true });
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = { router }

