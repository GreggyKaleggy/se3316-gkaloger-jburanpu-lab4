const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require("csv-parser");
const { getAlbums } = require('./albums');
const mongoose = require('mongoose');
const db = mongoose.connection;
const stringSim = require('string-similarity');


//route for /api/tracks
router.get('/', async (req, res) => {
    try {
        const result = await db.collection('tracks').find().toArray();
        res.json(result)
        console.log(result)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


//Getting the details needed given the track id
router.get('/:id', async (req, res) => {
    try {
        if (isNaN(req.params.id)) {
            return res.status(404).json('Track ID must be an integer');
        }
        if (req.params.id > 10000000) {
            return res.status(404).json({ errors: [{ msg: 'Enter a valid ID' }] })
        }

        const result = await db.collection('tracks').findOne({ track_id: req.params.id });
        if (!result) {
            return res.status(404).json({ errors: [{ msg: 'Track not found' }] });
        }
        const { album_id, album_title, artist_id, artist_name, tags, track_date_created, track_date_recorded, track_duration, track_genres, track_number, track_title } = result
        newObj = { album_id, album_title, artist_id, artist_name, tags, track_date_created, track_date_recorded, track_duration, track_genres, track_number, track_title }
        if (!newObj) {
            return res.status(404).json({ errors: [{ msg: 'No Tracks Found' }] });
        }
        res.json(newObj);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


/*
Get the first n number of matching track IDs for a given search pattern matching the track title or album. 
If the number of matches is less than n, then return all matches. Please feel free to pick a suitable value for n.
*/
router.get('/search/:title', async (req, res) => {
    try {
        const search = req.params.title;
        const regex = new RegExp(search, 'i')
        const result = await db.collection('tracks').find({ track_title: { $regex: regex } }).toArray();
        if (!result) {
            return res.status(404).json({ errors: [{ msg: 'No Tracks Found' }] });
        }
        if (Object.keys(result).length > 15) {
            const results = result.slice(0, 15);
            res.json(results);
        }
        else {
            res.json(result);
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/searchTracks', async (req, res) => {
    const searchName = req.query.name;
    const searchArtist = req.query.artist;
    const searchGenre = req.query.genre;

    try {
        const allTitles = await db.collection('tracks').find({}, { projection: { _id: 0, track_id: 1, track_title: 1, track_genres: 1, artist_name: 1 } }).toArray();
        if (!result) {
            return res.status(404).json({ errors: [{ msg: 'No Tracks Found' }] });
        }
        if (Object.keys(result).length > 15) {
            const results = result.slice(0, 15);
            res.json(results);
        }
        else {
            res.json(result);
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = { router }
