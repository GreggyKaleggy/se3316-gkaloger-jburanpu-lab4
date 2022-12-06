const express = require('express');
const router = express.Router();
const fs = require('fs')
const csv = require("csv-parser")
const mongoose = require('mongoose');
const db = mongoose.connection;


//@route    GET api/artists
//@desc     GET request to get all artists - from lab 3
//@access   Public
router.get('/', async (req, res) => {
    try {
        const results = await db.collection('artists').find().toArray();
        for (let i = 0; i < results.length; i++) {
            const { artist_id, artist_favorites, artist_handle, artist_location, artist_members, artist_name, tags } = results[i];
            results[i] = { artist_id, artist_favorites, artist_handle, artist_location, artist_members, artist_name, tags };
        }
        res.json(results);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//@route    GET api/artists/:id
//@desc     GET request to get artist by id - from lab 3
//@access   Public
router.get('/:id', async (req, res) => {
    try {
        if (isNaN(req.params.id)) {
            return res.status(404).json({ errors: [{ msg: 'Enter a number' }] });
        }
        const results = await db.collection('artists').findOne({ artist_id: req.params.id });

        if (!results) {
            return res.status(404).json({ errors: [{ msg: 'Artist does not exist' }] });
        }
        const { artist_id, artist_favorites, artist_handle, artist_location, artist_members, artist_name, tags } = results;
        newObj = { artist_id, artist_favorites, artist_handle, artist_location, artist_members, artist_name, tags };

        res.json(newObj)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//@route    GET api/artists/name/:name
//@desc     GET request to get artist by name - from lab 3
//@access   Public
router.get('/name/:name', async (req, res) => {
    try {
        const search = req.params.name;
        const regex = new RegExp(search, 'i')
        const result = await db.collection('artists').find({ artist_name: { $regex: regex } }).toArray();
        if (!result) {
            return res.status(404).json({ errors: [{ msg: 'No Tracks Found' }] });
        }
        for (let i = 0; i < result.length; i++) {
            const { artist_name, artist_id } = result[i];
            result[i] = { artist_name, artist_id };
        }
        res.json(result);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = { router }