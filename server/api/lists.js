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
const { find } = require('lodash');


//get all lists that are public
router.get('/', async (req, res) => {
    try {
        const lists = await List.find({ isPrivate: false }).sort({ modified: -1 }).limit(10);

        if (!req.header('x-auth-token')) {
            res.json(lists);

        } else {
            res.json(lists);
        }
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
    check('name', 'List name between 3 and 20 characters is required').not().isEmpty().isLength({ min: 3, max: 30 }),
    check('desc', 'Description can be a maximum 1000 characters').isLength({ min: 0, max: 1000 }),
], auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {
        const { name, desc } = req.body;
        const list = await List.findOne({ name: name });
        if (list) {
            return res.status(400).json({ error: 'List name already taken' });
        }
        numberOfLists = await List.countDocuments({ user: user.id });
        if (numberOfLists >= 20) {
            return res.status(400).json({ error: 'You have reached the maximum number of lists' });
        }
        const newList = new List({
            username: user.username,
            user: user.id,
            name: name,
            duration: 0,
            desc: desc
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
router.put('/add/:name', [
    check('name', 'List ID is required').not().isEmpty(),
    check('track_id', 'Track ID is required').not().isEmpty()
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {
        const { track_id } = req.body;
        const list = await List.findOne({ name: req.params.name });
        if (!list) {
            return res.status(400).json({ error: 'List not found' });
        }
        if (list.user != req.user.id) {
            return res.status(400).json({ error: 'You are not authorized to edit this list' });
        }

        for (let i = 0; i < list.tracklist.length; i++) {
            if (list.tracklist[i].track_id == req.body.track_id) {
                return res.status(400).json({ errors: [{ msg: "Track already in list" }] });
            }
        }

        const findTrack = await db.collection('tracks').findOne({ track_id: req.body.track_id });
        if (!findTrack) {
            return res.status(400).json({ error: 'Track not found' });
        }
        const trackduration = findTrack.track_duration;

        if (trackduration.length < 6) {
            var durationMin = "00:" + String(trackduration)
        }
        durationMin = moment.duration(durationMin).asMinutes();
        roundedDuration = Math.round(durationMin * 100) / 100;

        list.tracklist.push({ track_id: req.body.track_id, trackduration: roundedDuration, track_title: findTrack.track_title, artist_name: findTrack.artist_name, track_genres: findTrack.track_genres });
        list.numberofTracks = list.tracklist.length;
        list.duration = 0;
        for (let i = 0; i < list.tracklist.length; i++) {
            list.duration += list.tracklist[i].trackduration;
        }
        list.duration = Math.round(list.duration * 100) / 100;
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
    const user = await User.findById(req.user.id).select('-password');
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
    check('rating', 'Rating from 1 to 5 is required').not().isEmpty().isInt({ min: 1, max: 5 }),
    check('review', 'Review is optional upto 200 characters').not().isEmpty().isLength({ min: 0, max: 200 })
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {
        const reviewer = await User.findById(req.user.id)
        const { rating, review } = req.body;
        const reviews = {
            username: reviewer.username,
            rating,
            review,
            hidden: false
        }
        const list = await List.findOne({ name: req.params.name });
        for (let i = 0; i < list.reviews.length; i++) {
            if (list.reviews[i].username == reviewer.username) {
                return res.status(400).json({ errors: [{ msg: "You have already reviewed this list" }] });
            }
        }
        list.averageRating = 0
        for (let i = 0; i < list.reviews.length; i++) {
            const totalRating = list.reviews[i].rating;
            list.averageRating += totalRating;
        }
        list.averageRating = list.averageRating / list.reviews.length;
        list.reviews.unshift(reviews);
        await list.save();
        res.json(list);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})

router.put('/changeprivacy/:name/:value', auth, async (req, res) => {
    try {
        const value = req.params.value;
        const list = await List.findOne({ name: req.params.name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        list.isPrivate = value;
        await list.save();
        if (value == "true") {
            res.json("list is now private");
        }
        else {
            res.json("list is now public");
        }

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = { router };

