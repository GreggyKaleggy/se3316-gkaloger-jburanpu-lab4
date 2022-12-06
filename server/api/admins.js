const express = require('express');
const router = express.Router();
router.use(express.json());
const { check, validationResult } = require('express-validator');
const userSchema = require('../schema/userSchema');
const auth = require("../middleware/auth");
const config = require('../config');
const List = require('../schema/listSchema');


//@route    PUT api/admins/chageStatus
//@desc     PUT request to make an user an admin
//@access   Private + for admins only
router.put('/changestatus', [
    check('email', 'Please include valid email').isEmail().normalizeEmail()
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {

        const currentUser = await userSchema.findById(req.user.id);
        if (!currentUser.isAdmin) {
            return res.status(401).json({ errors: [{ msg: 'You are not authorized to perform this action' }] });
        }
        const { email, isAdmin } = req.body;
        let emailCheck = await User.findOne({ email: email });
        if (!emailCheck) {
            return res.status(400).json({ errors: [{ msg: 'Email address is not associated with any account' }] });
        }
        const user = await User.findOneAndUpdate({ email: email }, { $set: { isAdmin: isAdmin } }, { new: true });
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route    PUT api/admins/deactivate
//@desc     PUT request to deactivate an user
//@access   Private + for admins only
router.put('/deactivate', [
    check('email', 'Please include valid email').isEmail().normalizeEmail()
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {
        const currentUser = await userSchema.findById(req.user.id);
        if (!currentUser.isAdmin) {
            return res.status(401).json({ errors: [{ msg: 'You are not authorized to perform this action' }] });
        }
        const { email, deactivated } = req.body;
        let emailCheck = await User.findOne({ email: email });
        if (!emailCheck) {
            return res.status(400).json({ errors: [{ msg: 'Email address is not associated with any account' }] });
        }
        const user = await User.findOneAndUpdate({ email: email }, { $set: { deactivated } }, { new: true });
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});


//@route    PUT api/admins/reviewvisability
//@desc     PUT request to change visability of a review
//@access   Private + for admins only
router.put('/reviewvisability', auth, async (req, res) => {
    try {
        const currentUser = await userSchema.findById(req.user.id);
        if (!currentUser.isAdmin) {
            return res.status(401).json({ errors: [{ msg: 'You are not authorized to perform this action' }] });
        }
        const { list, username, hidden } = req.body;
        const updatedReview = await List.findOneAndUpdate({ name: list }, { $set: { 'reviews.$[elem].hidden': hidden } }, { arrayFilters: [{ 'elem.username': username }], new: true });
        res.json(updatedReview);
    }

    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    GET api/admins/admincheck
//@desc     GET request to check if user, this is for front end when a user is logging in
//@access   Private route
router.get('/admincheck', auth, async (req, res) => {
    try {
        const currentUser = await userSchema.findById(req.user.id);
        if (!currentUser.isAdmin) {
            res.json({ isAdmin: false });
        } else {
            res.json({ isAdmin: true });
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = { router }