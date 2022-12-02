const express = require('express');
const router = express.Router();
router.use(express.json());
const { check, validationResult } = require('express-validator');
const userSchema = require('../schema/userSchema');
const auth = require("../middleware/auth");
const config = require('../config');


//admin ability to make others admin
router.put('/changestatus', auth, async (req, res) => {
    try {
        const currentUser = await userSchema.findById(req.user.id);
        if (!currentUser.isAdmin) {
            return res.status(401).json({ msg: 'You are not authorized to perform this action' });
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

//admin deactivating users
router.put('/deactivate', auth, async (req, res) => {
    try {
        const currentUser = await userSchema.findById(req.user.id);
        if (!currentUser.isAdmin) {
            return res.status(401).json({ msg: 'You are not authorized to perform this action' });
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

module.exports = { router }