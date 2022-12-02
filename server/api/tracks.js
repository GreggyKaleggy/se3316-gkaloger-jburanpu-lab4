const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require("csv-parser");
const { getAlbums } = require('./albums');
const mongoose = require('mongoose');
const db = mongoose.connection;
const stringSim = require('string-similarity');
var cloneDeep = require('lodash.clonedeep');

//route for /api/tracks
router.get('/', async (req, res) => {
    try {
        const result = await db.collection('tracks').find().toArray();
        res.json(result)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


//Getting the details needed given the track id
router.get('/trackID/:id', async (req, res) => {
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

router.get('/trackSearch', async (req, res) => {
    var searchName = req.query.name;
    var searchArtist = req.query.artist;
    var searchGenre = req.query.genre;
    try {
        const allTracks = await db.collection('tracks').find({}, { projection: { _id: 0, track_id: 1, track_title: 1, track_genres: 1, artist_name: 1 } }).toArray();
        if (typeof searchName !== "undefined") {
            searchName = searchName.replace(/\s+/g, '').toUpperCase();
            var nameResult = cloneDeep(allTracks.filter(t => stringSim.compareTwoStrings(searchName, String(t.track_title).replace(/\s+/g, '').toUpperCase()) >= 0.50))
        }


        if (typeof searchArtist !== "undefined") {
            searchArtist = searchArtist.replace(/\s+/g, '').toUpperCase();
            var artistResult = cloneDeep(allTracks.filter(t => stringSim.compareTwoStrings(searchArtist, String(t.artist_name).replace(/\s+/g, '').toUpperCase()) >= 0.50))
        }

        if (typeof searchGenre !== "undefined") {
            searchGenre = searchGenre.replace(/\s+/g, '').toUpperCase();
            var genreTracks = cloneDeep(allTracks.filter(t => t.track_genres !== ""));
            genreTracks.forEach(t => t.track_genres = JSON.parse(t.track_genres.replace(/'/g, '"')));
            var genreResult = cloneDeep(genreTracks.filter(t => t.track_genres.some(g => stringSim.compareTwoStrings(searchGenre, String(g.genre_title).replace(/\s+/g, '').toUpperCase()) >= 0.50)))
        }

        if (typeof searchName !== "undefined" && typeof searchArtist !== "undefined" && typeof searchGenre !== "undefined") {
            var result = nameResult.filter(t => artistResult.some(a => a.track_id === t.track_id) && genreResult.some(g => g.track_id === t.track_id));
        }
        else if (typeof searchName !== "undefined" && typeof searchArtist !== "undefined") {
            var result = nameResult.filter(t => artistResult.some(a => a.track_id === t.track_id));
        }
        else if (typeof searchName !== "undefined" && typeof searchGenre !== "undefined") {
            var result = nameResult.filter(t => genreResult.some(g => g.track_id === t.track_id));
        }
        else if (typeof searchArtist !== "undefined" && typeof searchGenre !== "undefined") {
            var result = artistResult.filter(t => genreResult.some(g => g.track_id === t.track_id));
        }
        else if (typeof searchName !== "undefined") {
            var result = nameResult;
        }
        else if (typeof searchArtist !== "undefined") {
            var result = artistResult;
        }
        else if (typeof searchGenre !== "undefined") {
            var result = genreResult;
        }
        else {
            return res.status(404).json({ errors: [{ msg: 'No input provided' }] });
        }

        if (!result) {
            return res.status(404).json({ errors: [{ msg: 'No Tracks Found' }] });
        }
        res.json(result);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = { router }
