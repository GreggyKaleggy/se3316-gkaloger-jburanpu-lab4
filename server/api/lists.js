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


// @route    GET api/lists
// @desc     GET request to get all public lists, only shows 10 if not logged in
// @access   Public
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

// @route    GET api/lists/mylists
// @desc     GET request to get all user lists 
// @access   Private
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


//@route    POST api/lists/new
//@desc     POST request to create a new list
//@access   Private
router.post('/new', [
    //input validation using express-validator
    check('name', 'List name between 3 and 20 characters is required').not().isEmpty().isLength({ min: 3, max: 30 }),
    check('desc', 'Description can be a maximum 1000 characters').isLength({ min: 0, max: 1000 }),
    check('track_ids', 'Track IDs are needed').not().isEmpty().isLength({ min: 1, max: 100 }),
], auth, async (req, res) => {

    //get user from token
    const user = await User.findById(req.user.id).select('-password');
    const errors = validationResult(req);

    //check for errors
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {
        const { name, desc, track_ids } = req.body;
        const list = await List.findOne({ name: name });

        //check if list name already exists
        if (list) {
            return res.status(400).json({ errors: [{ msg: 'List name already taken' }] });
        }

        //check if user has reached the maximum number of lists
        numberOfLists = await List.countDocuments({ user: user.id });
        if (numberOfLists >= 20) {
            return res.status(400).json({ errors: [{ msg: 'You have reached the maximum number of lists' }] });
        }

        //check if track_ids are valid
        var tracksSliced = track_ids.split(' ');
        tracksSliced = [...new Set(tracksSliced)];
        for (let i = 0; i < tracksSliced.length; i++) {
            var findTrack = await db.collection('tracks').findOne({ track_id: tracksSliced[i] });
            if (!findTrack) {
                return res.status(400).json({ errors: [{ msg: 'Track not found' }] });
            }
            else {
                //calculate duration
                const trackDuration = findTrack.track_duration;
                if (trackDuration.length < 6) {
                    var durationMin = "00:" + String(trackDuration)
                }
                durationMin = moment.duration(durationMin).asMinutes();
                roundedDuration = Math.round(durationMin * 100) / 100;
                tracksSliced[i] = {
                    //Push all results
                    track_id: findTrack.track_id,
                    trackduration: roundedDuration,
                    track_title: findTrack.track_title,
                    artist_name: findTrack.artist_name,
                    track_genres: findTrack.track_genres
                }
            }
        }

        //create new list
        const newList = new List({
            username: user.username,
            user: user.id,
            name: name,
            desc: desc,
            duration: 0,
            numberofTracks: tracksSliced.length,
            tracklist: tracksSliced,
        });

        //calculate list duration
        newList.duration = 0;
        for (let i = 0; i < newList.tracklist.length; i++) {
            newList.duration += newList.tracklist[i].trackduration;
        }
        newList.duration = Math.round(newList.duration * 100) / 100;

        await newList.save();
        res.json(newList);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


// @route    PUT api/lists/editlist
// @desc     PUT request to edit a list given newName and newDesc
// @access   Private
router.put('/editlist', [
    //input validation using express-validator
    check('newName', 'List name between 3 and 20 characters is required').not().isEmpty().isLength({ min: 3, max: 30 }),
    check('newDesc', 'Description can be a maximum 1000 characters').isLength({ min: 0, max: 1000 }),
], auth, async (req, res) => {
    //display errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {
        const { name, newName, newDesc } = req.body;
        //check if list exists
        const list = await List.findOne({ name: name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        //check if user is authorized to edit list
        if (list.user != req.user.id) {
            return res.status(400).json({ errors: [{ msg: 'You are not authorized to edit this list' }] });
        }
        //check if list name already exists
        const listName = await List.findOne({ name: newName });
        if (listName && list.user != req.user.id) {
            return res.status(400).json({ errors: [{ msg: "List name is already taken" }] });
        }

        //update list with new name and new description
        list.name = newName;
        list.description = newDesc;
        list.modified = Date.now();
        await list.save();
        res.json(list);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})

// @route    PUT api/lists/addTracks
// @desc     PUT request to add tracks to a list with space separated track_ids
// @access   Private
router.put('/addTracks', [
    //input validation using express-validator
    check('name', 'List ID is required').not().isEmpty(),
    check('track_ids', 'Track ID is required').not().isEmpty().isLength({ min: 1, max: 100 }),
], auth, async (req, res) => {
    //display errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {
        const { name, track_ids } = req.body;
        //check if list exists
        const list = await List.findOne({ name: name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: 'List not found' }] });
        }

        //check if user is authorized to edit list
        if (list.user != req.user.id) {
            return res.status(400).json({ errors: [{ msg: 'You are not authorized to edit this list' }] });
        }

        //check if track exists
        var tracksSliced = track_ids.split(' ');
        tracksSliced = [...new Set(tracksSliced)];

        for (let i = 0; i < tracksSliced.length; i++) {
            var findTrack = await db.collection('tracks').findOne({ track_id: tracksSliced[i] });
            if (!findTrack) {
                return res.status(400).json({ errors: [{ msg: 'Track not found' }] });
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

        //replace existing tracks in tracklist 
        list.tracklist = list.tracklist.concat(tracksSliced);
        const unique = [...new Map(list.tracklist.map(item => [item['track_id'], item])).values()];
        list.tracklist = unique;

        //recalculate number of tracks and duration
        list.numberofTracks = list.tracklist.length;
        list.duration = 0;
        for (let i = 0; i < list.tracklist.length; i++) {
            list.duration += list.tracklist[i].trackduration;
        }
        list.duration = Math.round(list.duration * 100) / 100;
        list.modified = Date.now();
        await list.save();
        res.json(list);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

// @route    DELETE api/lists/deleteTracks
// @desc     DELETE request to delete tracks from a list with space separated track_ids
// @access   Private
router.delete('/deleteTracks', [
    //input validation using express-validator
    check('name', 'List name is required').not().isEmpty(),
    check('track_ids', 'Track ID is required').not().isEmpty().isLength({ min: 1, max: 100 }),
], auth, async (req, res) => {
    //display errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {
        const { name, track_ids } = req.body;
        //check if list exists
        const list = await List.findOne({ name: name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        //check if user is authorized to edit list
        if (list.user != req.user.id) {
            return res.status(400).json({ errors: [{ msg: 'You are not authorized to edit this list' }] });
        }
        //check if list is empty
        if (list.tracklist.length == 0) {
            return res.status(400).json({ errors: [{ msg: 'List is empty' }] });
        }
        //check if track exists in list
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
        //recalculate number of tracks and duration
        list.numberofTracks = list.tracklist.length;
        list.duration = 0;
        for (let i = 0; i < list.tracklist.length; i++) {
            list.duration += list.tracklist[i].trackduration;
        }
        list.duration = Math.round(list.duration * 100) / 100;
        list.modified = Date.now();
        await list.save();
        res.json(list);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})


// @route    PUT api/lists/changePrivacy
// @desc     PUT request to change privacy of a list
// @access   Private
router.put('/changePrivacy', auth, async (req, res) => {
    try {
        const { name, value } = req.body;
        const list = await List.findOne({ name: name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        if (list.user != req.user.id) {
            return res.status(400).json({ errors: [{ msg: 'You are not authorized to edit this list' }] });
        }
        //change modified date
        list.modified = Date.now();
        list.isPrivate = value;
        await list.save();
        //return message
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


// @route    DELETE api/lists/deleteList
// @desc     DELETE request to delete a list
// @access   Private
router.delete('/deleteList', auth, async (req, res) => {
    try {
        //check if list exists
        const { name } = req.body;
        const list = await List.findOne({ name: name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        //check if user is authorized to edit list
        if (list.user != req.user.id) {
            return res.status(400).json({ errors: [{ msg: 'You are not authorized to edit this list' }] });
        }
        //delete list
        await list.remove();
        res.json("list deleted");

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})


// @route    POST api/lists/review
// @desc     POST request to review a list
// @access   Private
router.post('/review', [
    //input validation using express-validator
    check('rating', 'Rating from 1 to 5 is required').not().isEmpty().isInt({ min: 1, max: 5 }),
    check('review', 'Review is optional upto 200 characters').not().isEmpty().isLength({ min: 0, max: 200 })
], auth, async (req, res) => {
    //display errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorMsg = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: [{ msg: errorMsg }] });
    }
    try {
        const reviewer = await User.findById(req.user.id)
        const { name, rating, review } = req.body;
        const reviews = {
            username: reviewer.username,
            rating,
            review,
            hidden: false
        }
        const list = await List.findOne({ name: name });
        for (let i = 0; i < list.reviews.length; i++) {
            if (list.reviews[i].username == reviewer.username) {
                return res.status(400).json({ errors: [{ msg: "You have already reviewed this list" }] });
            }
        }
        //Put review on top 
        list.reviews.unshift(reviews);

        //calculate average rating
        list.averageRating = 0
        for (let i = 0; i < list.reviews.length; i++) {
            const totalRating = list.reviews[i].rating;
            list.averageRating += totalRating;
        }
        list.averageRating = list.averageRating / list.reviews.length;
        list.averageRating = Math.round(list.averageRating * 100) / 100;
        await list.save();
        res.json(list);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})
module.exports = { router };

