const express = require('express');
const moment = require('moment')
const router = express.Router();
router.use(express.json());
const List = require('../schema/listSchema');
const { db } = require('../schema/listSchema');
const { check, validationResult } = require('express-validator');
const abbrev = require('abbrev');
const auth = require("../middleware/auth");
const userSchema = require('../schema/userSchema');


//get all lists that are public
router.get('/', async (req, res) => {
    try {
        const lists = await List.find({ isPrivate: false });
        res.json(lists);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



//Get all user lists
router.get('/mylists', auth, async (req, res) => {
    try {
        const currentUser = await userSchema.findById(req.user.id);
        const lists = await List.find({ user: currentUser.id });
        res.json(lists);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


//Make a new list
router.post('/new', [
    check('name', 'List name between 3 and 20 characters is required').not().isEmpty().isLength({ min: 3, max: 20 }),
    check('desc', 'Description can be a maximum 1000 characters').isLength({ min: 0, max: 1000 }),
    check('isPrivate', 'Please clarify is the list is private or public').isBoolean()
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {

        const { name, desc, isPrivate } = req.body;
        //if name is already taken, return error
        const list = await List.findOne
            ({ name: name });
        if (list) {
            return res.status(400).json({ error: 'List name already taken' });
        }

        const newList = new List({
            user: req.user.id,
            name: name,
            duration: 0,
            desc: desc,
            isPrivate: isPrivate,

        });

        await newList.save();
        res.json(newList);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


//Add a track to a list
router.put('/add', [
    check('name', 'List ID is required').not().isEmpty(),
    check('trackID', 'Track ID is required').not().isEmpty()
], auth, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }

    try {
        const list = await List.find({ user: req.user.id });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        const trackCheck = await db.collection('tracks').findOne({ track_id: req.body.trackID });
        if (!trackCheck) {
            return res.status(400).json({ errors: [{ msg: "Track doesn't exist" }] });
        }
        for (let i = 0; i < list.tracklist.length; i++) {
            if (list.tracklist[i].trackID == req.body.trackID) {
                return res.status(400).json({ errors: [{ msg: "Track already in list" }] });
            }
        }
        const findTrack = await db.collection('tracks').find({ track_id: req.body.trackID }).toArray();
        const trackduration = findTrack[0].track_duration;

        if (trackduration.length < 6) {
            var durationMin = "00:" + String(trackduration)
        }
        durationMin = moment.duration(durationMin).asMinutes();
        roundedDuration = Math.round(durationMin * 100) / 100;

        list.tracklist.push({ trackID: req.body.trackID, trackduration: roundedDuration });
        list.numberofTracks = list.tracklist.length;

        list.duration = 0;
        for (let i = 0; i < list.tracklist.length; i++) {
            list.duration += list.tracklist[i].trackduration;
        }

        await list.save();
        res.json(list);

    }

    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


//Delete a list
router.delete('/delete/:name', auth, async (req, res) => {
    try {
        const userLists = await List.find({ user: req.user.id });
        const list = await List.findOne({ name: req.params.name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        await list.remove();
        res.json("list deleted");

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})


//Delete a track from a list
router.delete('/delete/:name/:trackID', auth, async (req, res) => {
    try {
        const userLists = await List.find({ user: req.user.id });
        const list = await List.findOne({ name: req.params.name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        oldLength = list.tracklist.length;
        for (let i = 0; i < list.tracklist.length; i++) {
            if (list.tracklist[i].trackID == req.params.trackID) {
                list.tracklist.splice(i, 1);
            }
        }
        if (oldLength == list.tracklist.length) {
            return res.status(400).json({ errors: [{ msg: "Track is not in the list" }] });
        }
        list.numberofTracks = list.tracklist.length;

        list.duration = 0;
        for (let i = 0; i < list.tracklist.length; i++) {
            list.duration += list.tracklist[i].trackduration;
        }

        await list.save();
        res.json(list);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})


//leave reviews on a list
router.post('/review/:name', [
    check('stars', 'Give the list a rating of from 1 to 5. 1 being the lowest, 5 being the highest').not().isEmpty().isInt({ min: 1, max: 5 }),
    check('review', 'Review can be a maximum 200 characters').isLength({ min: 0, max: 200 })
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {
        const list = await List.find({ isPrivate: false });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        const user = await User.findById(req.user.id).select('-password');
        const username = user.username;
        const { stars, review } = req.body;
        const newReview = {
            user: username,
            stars: stars,
            review: review
        }
        console.log(newReview);
        list.reviews.push(newReview);
        await list.save();
        res.json(list);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})



module.exports = { router };

