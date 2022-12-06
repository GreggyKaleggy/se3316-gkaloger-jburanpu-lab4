const express = require('express');
const router = express.Router();
router.use(express.json());
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userSchema = require('../schema/userSchema');
const auth = require("../middleware/auth");
const config = require('../config');


//@route    POST api/users/login
//@desc     POST request to login a user
//@access   Public
router.post('/login', [
    //Input validation using express-validator
    check('email', 'Please include valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter valid password').isLength({ min: 6, max: 30 }).trim().escape()
], async (req, res) => {
    //Display errors if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    const { email, password } = req.body;
    try {
        //Check if user exists
        let user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        //Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        //Check if user is deactivated
        if (user.deactivated) {
            return res.status(400).json({ errors: [{ msg: 'The account is deactivated, please contact an admin' }] });
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        //Return jsonwebtoken
        jwt.sign(payload, config.jwtSecret, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            //if user is unverified, send a link to verify
            if (!user.verified) {
                const link = req.protocol + '://' + req.get('host') + '/api/users/verify/' + user.email + '/' + token;
                res.json({ verify: [{ msg: link }] });
            }
            //else send the token
            else {
                res.json({ token });
            }
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});


//@route    POST api/users/register
//@desc     POST request to register a user
//@access   Public
router.post('/register', [
    //Input validation using express-validator
    check('username', 'a username between 3 and 25 characters is required').not().isEmpty().trim().escape().isLength({ min: 3, max: 25 }),
    check('email', 'Please include valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter valid password').isLength({ min: 6, max: 30 }).trim().escape()
], async (req, res) => {
    //Display errors if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {
        const { username, email, password } = req.body;
        //Check if email exists
        let emailname = await User.findOne({ email });
        if (emailname) {
            return res.status(400).json({ errors: [{ msg: 'Email address is already associated with an account' }] });
        }
        //Check if username has any special characters or numbers
        if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(username)) {
            return res.status(400).json({ errors: [{ msg: 'Name should not contain any numbers or special characters' }] });
        }
        user = new User({
            username,
            email,
            password
        });
        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        }

        //Return jsonwebtoken
        jwt.sign(payload, config.jwtSecret, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            //if user is unverified, send a link to verify
            if (!user.verified) {
                const link = req.protocol + '://' + req.get('host') + '/api/users/verify/' + user.email + '/' + token;
                res.json({ verify: [{ msg: link }] });
            }
            //else send the token
            else {
                res.json({ token });
            }
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


//@route    PUT api/users/changepassword
//@desc     PUT request to change password
//@access   Private
router.put('/changepassword', [
    //Input validation using express-validator
    check('newPassword', 'Please enter valid password').isLength({ min: 6, max: 30 }).trim().escape()
], async (req, res) => {
    //Display errors if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {
        const { email, oldPassword, newPassword } = req.body;
        //Check if email exists
        let emailCheck = await User.findOne({ email });
        if (!emailCheck) {
            return res.status(400).json({ errors: [{ msg: 'Email address is not associated with any account' }] });
        }
        const isMatch = await bcrypt.compare(oldPassword, emailCheck.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'The old password you entered is incorrect' }] });
        }
        //Check if new password is same as old password
        const samePass = await bcrypt.compare(newPassword, emailCheck.password);
        if (samePass) {
            return res.status(400).json({ errors: [{ msg: 'The new password you entered is the same as the old password' }] });
        }
        //Encrypt password
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


//@route    GET api/users/verify/:email/:token
//@desc     GET request to make a custom link using token to verify user
//@access   Public - One per user and genereates a new token every time
router.get('/verify/:email/:token', async (req, res) => {
    try {
        const { email, token } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Link is invalid' });
        }
        if (user.verified) {
            return res.status(400).json({ msg: 'Account already verified' });
        }
        jwt.verify(token, config.jwtSecret, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ msg: 'Link is invalid' });
            }
            else {
                user.verified = true;
                await user.save();
                res.json({ msg: 'Account verified successfully' });
            }
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = { router }

