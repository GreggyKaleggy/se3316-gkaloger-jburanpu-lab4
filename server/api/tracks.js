const express = require('express');
const router = express.Router();
router.use(express.json());
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

        const result = await db.collection('tracks').findOne({ track_id: req.params.id }, { projection: { _id: 0, album_id: 1, album_title: 1, artist_id: 1, artist_name: 1, tags: 1, track_date_created: 1, track_date_recorded: 1, track_duration: 1, track_genres: 1, track_number: 1, track_title: 1} });
        if (!result) {
            return res.status(404).json({ errors: [{ msg: 'Track not found' }] });
        }
        res.json(result);
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

router.post('/trackSearch', async (req, res) => {
    var {searchName, searchArtist, searchGenre} = req.body
    if (searchName == "" && searchArtist == "" && searchGenre == ""){
        return res.status(404).json({ errors: [{ msg: 'No input provided' }] });
    }
    try {
        const allTracks = await db.collection('tracks').find({}, { projection: { _id: 0, track_id: 1, track_title: 1, track_genres: 1, artist_name: 1 } }).toArray();
        if (searchName !== "") {
            searchName = searchName.replace(/\s+/g, '').toUpperCase();
            var nameResult = cloneDeep(allTracks.filter(t => stringSim.compareTwoStrings(searchName, String(t.track_title).replace(/\s+/g, '').toUpperCase()) >= 0.70))
        }

        if (searchArtist !== "") {
            searchArtist = searchArtist.replace(/\s+/g, '').toUpperCase();
            var artistResult = cloneDeep(allTracks.filter(t => stringSim.compareTwoStrings(searchArtist, String(t.artist_name).replace(/\s+/g, '').toUpperCase()) >= 0.50))
        }

        if (searchGenre !== "") {
            searchGenre = searchGenre.replace(/\s+/g, '').toUpperCase();
            var genreTracks = cloneDeep(allTracks.filter(t => t.track_genres !== ""));
            genreTracks.forEach(t => t.track_genres = JSON.parse(t.track_genres.replace(/'/g, '"')));
            var genreResult = cloneDeep(genreTracks.filter(t => t.track_genres.some(g => stringSim.compareTwoStrings(searchGenre, String(g.genre_title).replace(/\s+/g, '').toUpperCase()) >= 0.50)))
        }

        if (searchName !== "" && searchArtist !== "" && searchGenre !== "") {
            var result = nameResult.filter(t => artistResult.some(a => a.track_id === t.track_id) && genreResult.some(g => g.track_id === t.track_id));
        }
        else if (searchName !== "" && searchArtist !== "") {
            var result = nameResult.filter(t => artistResult.some(a => a.track_id === t.track_id));
        }
        else if (searchName !== "" && searchGenre !== "") {
            var result = nameResult.filter(t => genreResult.some(g => g.track_id === t.track_id));
        }
        else if (searchArtist !== "" && searchGenre !== "") {
            var result = artistResult.filter(t => genreResult.some(g => g.track_id === t.track_id));
        }
        else if (searchName !== "") {
            var result = nameResult;
        }
        else if (searchArtist !== "") {
            var result = artistResult;
        }
        else if (searchGenre !== "") {
            var result = genreResult;
        }
        else {
            return res.status(404).json({ errors: [{ msg: 'You should never be here: Something REALLY went wrong...' }] });
        }

        if (result.length === 0) {
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
