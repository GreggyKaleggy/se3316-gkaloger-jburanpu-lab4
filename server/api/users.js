const express = require('express');
const router = express.Router();
router.use(express.json());
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userSchema = require('../schema/userSchema');
const auth = require("../middleware/auth");
const config = require('../config');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {

        let user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        if (user.deactivated) {
            return res.status(400).json({ msg: 'The account is deactivated, please contact an admin' });
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.jwtSecret, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});



router.post('/register', [
    check('username', 'a username between 3 and 25 characters is required').not().isEmpty().trim().escape().isLength({ min: 3, max: 25 }),
    check('email', 'Please include valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter valid password').isLength({ min: 6, max: 30 }).trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {
        const { username, email, password } = req.body;
        let emailname = await User.findOne({ email });
        if (emailname) {
            return res.status(400).json({ errors: [{ msg: 'Email address is already associated with an account' }] });
        }
        if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(username)) {
            return res.status(400).json({ errors: [{ msg: 'Name should not contain any numbers or special characters' }] });
        }
        user = new User({
            username,
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
    check('newPassword', 'Please enter valid password').isLength({ min: 6, max: 30 }).trim().escape()
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {
        const { email, oldPassword, newPassword } = req.body;
        let emailCheck = await User.findOne({ email });
        if (!emailCheck) {
            return res.status(400).json({ errors: [{ msg: 'Email address is not associated with any account' }] });
        }
        const isMatch = await bcrypt.compare(oldPassword, emailCheck.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'The old password you entered is incorrect' }] });
        }
        const samePass = await bcrypt.compare(newPassword, emailCheck.password);
        if (samePass) {
            return res.status(400).json({ errors: [{ msg: 'The new password you entered is the same as the old password' }] });
        }
        const salt = await bcrypt.genSalt(10);
        emailCheck.password = await bcrypt.hash(newPassword, salt);
        await emailCheck.save()
        res.json({ msg: 'Password changed successfully' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = { router }

