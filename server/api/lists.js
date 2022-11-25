const { application } = require('express');
const e = require('express');
const express = require('express');
const moment = require('moment')
const router = express.Router();
router.use(express.json());
const { getTracks } = require('./tracks')
const List = require('../schema/listSchema');
const { db } = require('../schema/listSchema');


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
router.post('/new', async (req, res) => {
    try {
        const tracks = await getTracks();

        const { name } = req.body;
        const list = new List({
            name: name,
            duration: 0,
            tracklist: []
        });
        //if the list name is already in the database, return an error
        const listExists = await List.findOne({ name: name });
        if (listExists) {
            return res.status(400).json({ errors: [{ msg: 'List already exists' }] });
        }
        if (name.length < 3) {
            return res.status(400).json({ errors: [{ msg: 'List name must be at least 3 characters' }] });
        }
        if (name.length > 20) {
            return res.status(400).json({ errors: [{ msg: 'List name must be less than 20 characters' }] });
        }

        await list.save();
        res.json(list);
    }
    //If error, return 500
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


//Add a track to a list
router.put('/add', async (req, res) => {
    try {
        const tracks = await getTracks();
        const list = await List.findOne({ name: req.body.name });

        if (!list) {
            return res.status(400).json({ errors: [{ msg: "List doesn't exist" }] });
        }

        const track = tracks.find(track => track.track_id === req.body.trackID);
        if (!track) {
            return res.status(400).json({ errors: [{ msg: "Track doesn't exist" }] });
        }

        for (let i = 0; i < list.tracklist.length; i++) {
            if (parseInt(list.tracklist[i].trackID) === parseInt(req.body.trackID)) {
                return res.status(400).json({ erros: [{ msg: "Track already exists in list" }] });
            }
        }

        const trackduration = tracks.find(c => c.track_id === req.body.trackID).track_duration;
        if(trackduration.length < 6){
            var durationMin = "00:"+String(trackduration)
        }
          durationMin = moment.duration(durationMin).asMinutes();

        list.tracklist.push({ trackID: req.body.trackID, trackduration: durationMin});

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
        res.json({ msg: 'List removed' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
})


module.exports = { router }