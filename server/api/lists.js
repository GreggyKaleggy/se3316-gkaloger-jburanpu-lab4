const express = require('express');
const moment = require('moment')
const router = express.Router();
router.use(express.json());
const List = require('../schema/listSchema');
const { db } = require('../schema/listSchema');
const { check, validationResult } = require('express-validator');
const abbrev = require('abbrev');


//Get all lists
router.get('/', async (req, res) => {
    try {
        const list = await List.find()
        res.json(list);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//Make a new list with a name 
router.post('/new', [
    check('name', 'List name between 3 and 20 characters is required').not().isEmpty().isLength({ min: 3, max: 20 }),
    check('desc', 'Description can be a maximum 1000 characters').isLength({ min: 0, max: 1000 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }
    try {

        const { name, desc } = req.body;
        //if name is already taken, return error
        const list = await List.findOne
            ({ name: name });
        if (list) {
            return res.status(400).json({ error: 'List name already taken' });
        }
        //create new list
        const newList = new List({
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
router.put('/add', [
    check('name', 'List ID is required').not().isEmpty(),
    check('trackID', 'Track ID is required').not().isEmpty()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }

    try {
        const list = await List.findOne({ name: req.body.name });
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

//Get tracks from a list from a given list name
router.get('/:name', async (req, res) => {
    try {
        const list = await List.findOne({ name: req.params.name });
        res.json(list);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})

//Delete a list
router.delete('/delete/:name', async (req, res) => {
    try {
        const list = await List.findOne({ name: req.params.name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }
        await list.remove();
        res.json({ msg: 'List deleted' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})

//Delete a track from a list
router.delete('/delete/:name/:trackID', async (req, res) => {
    try {
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

router.put('/editlist/:name', [
    check('newName', 'List name between 3 and 20 characters is required').not().isEmpty().isLength({ min: 3, max: 20 }),
    check('newDesc', 'Description can be a maximum 1000 characters').isLength({ min: 0, max: 1000 })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        error = errors.array().map(error => error.msg);
        return res.status(400).json({ error });
    }

    try {
        const list = await List.findOne({ name: req.params.name });
        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }

        const newInfo = {
            name: req.body.newName,
            desc: req.body.newDesc
        }

        list.name = newInfo.name;
        list.desc = newInfo.desc;

        await list.save();
        res.json(list);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = { router }