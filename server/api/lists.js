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
    check('track_ids', 'Track IDs are needed').not().isEmpty().isLength({ min: 1, max: 100 }),
], auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {
        const { name, desc, track_ids } = req.body;
        const list = await List.findOne({ name: name });
        if (list) {
            return res.status(400).json({ errors: [{ msg: 'List name already taken' }] });
        }
        numberOfLists = await List.countDocuments({ user: user.id });
        if (numberOfLists >= 20) {
            return res.status(400).json({ errors: [{ msg: 'You have reached the maximum number of lists' }] });
        }
        var tracksSliced = track_ids.split(' ');
        tracksSliced = [...new Set(tracksSliced)];
        for (let i = 0; i < tracksSliced.length; i++) {
            var findTrack = await db.collection('tracks').findOne({ track_id: tracksSliced[i] });
            if (!findTrack) {
                return res.status(400).json({ errors:[{msg:'Track not found'}]});
            }
            else {
                const trackDuration = findTrack.track_duration;
                if (trackDuration.length < 6) {
                    var durationMin = "00:" + String(trackDuration)
                }
                durationMin = moment.duration(durationMin).asMinutes();
                roundedDuration = Math.round(durationMin * 100) / 100;
                tracksSliced[i] = {
                    track_id: findTrack.track_id,
                    trackduration: roundedDuration,
                    track_title: findTrack.track_title,
                    artist_name: findTrack.artist_name,
                    track_genres: findTrack.track_genres
                }
            }
        }


        const newList = new List({
            username: user.username,
            user: user.id,
            name: name,
            desc: desc,
            duration: 0,
            numberofTracks: tracksSliced.length,
            tracklist: tracksSliced,
        });

        newList.duration = 0;
        for (let i = 0; i < newList.tracklist.length; i++) {
            newList.duration += newList.tracklist[i].trackduration;
        }

        await newList.save();
        res.json(newList);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/editlist', [
    check('newName', 'List name between 3 and 20 characters is required').not().isEmpty().isLength({ min: 3, max: 30 }),
    check('newDesc', 'Description can be a maximum 1000 characters').isLength({ min: 0, max: 1000 }),
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {
        const { name, newName, newDesc } = req.body;
        const list = await List.findOne({ name: name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        if (list.user != req.user.id) {
            return res.status(400).json({ errors: [{msg: 'You are not authorized to edit this list'}] });
        }
        const listName = await List.findOne({ name: newName });
        if (listName && list.user != req.user.id) {
            return res.status(400).json({ errors: [{ msg: "List name is already taken" }] });
        }
        list.name = newName;
        list.description = newDesc;
        await list.save();
        res.json(list);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})

//Add a track to a list
router.put('/addTracks', [
    check('name', 'List ID is required').not().isEmpty(),
    check('track_ids', 'Track ID is required').not().isEmpty().isLength({ min: 1, max: 100 }),
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {
        const { name, track_ids } = req.body;
        const list = await List.findOne({ name: name });

        if (!list) {
            return res.status(400).json({ errors: [{msg: 'List not found'}] });
        }

        if (list.user != req.user.id) {
            return res.status(400).json({ errors: [{msg: 'You are not authorized to edit this list'}] });
        }

        var tracksSliced = track_ids.split(' ');
        tracksSliced = [...new Set(tracksSliced)];

        for (let i = 0; i < tracksSliced.length; i++) {
            var findTrack = await db.collection('tracks').findOne({ track_id: tracksSliced[i] });
            if (!findTrack) {
                return res.status(400).json({ errors: [{msg: 'Track not found'}] });
            }

            else {
                const trackDuration = findTrack.track_duration;
                if (trackDuration.length < 6) {
                    var durationMin = "00:" + String(trackDuration)
                }
                durationMin = moment.duration(durationMin).asMinutes();
                roundedDuration = Math.round(durationMin * 100) / 100;
                tracksSliced[i] = {
                    track_id: findTrack.track_id,
                    trackduration: roundedDuration,
                    track_title: findTrack.track_title,
                    artist_name: findTrack.artist_name,
                    track_genres: findTrack.track_genres
                }
            }
        }
        list.tracklist = list.tracklist.concat(tracksSliced);
        const unique = [...new Map(list.tracklist.map(item => [item['track_id'], item])).values()];
        list.tracklist = unique;
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

//Delete a track from a list
router.delete('/deleteTracks', [
    check('name', 'List name is required').not().isEmpty(),
    check('track_ids', 'Track ID is required').not().isEmpty().isLength({ min: 1, max: 100 }),
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {
        const { name, track_ids } = req.body;
        const list = await List.findOne({ name: name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        if (list.user != req.user.id) {
            return res.status(400).json({ errors: [{ msg: 'You are not authorized to edit this list'}] });
        }
        if (list.tracklist.length == 0) {
            return res.status(400).json({ errors: [{msg: 'List is empty'}] });
        }
        oldSize = list.tracklist.length;
        var tracksSliced = track_ids.split(' ');
        tracksSliced = [...new Set(tracksSliced)];
        for (let i = 0; i < tracksSliced.length; i++) {
            for (let j = 0; j < list.tracklist.length; j++) {
                if (list.tracklist[j].track_id == tracksSliced[i]) {
                    list.tracklist.splice(j, 1);
                }
            }
        }
        newSize = list.tracklist.length;
        if (oldSize == newSize) {
            return res.status(400).json({ errors: [{ msg: 'Track not found in list' }] });
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
        list.reviews.unshift(reviews);
        list.averageRating = 0
        for (let i = 0; i < list.reviews.length; i++) {
            const totalRating = list.reviews[i].rating;
            list.averageRating += totalRating;
        }
        list.averageRating = list.averageRating / list.reviews.length;
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
        if (list.user != req.user.id) {
            return res.status(400).json({ error: 'You are not authorized to edit this list' });
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

