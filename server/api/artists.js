const express = require('express');
const router = express.Router();
const fs = require('fs')
const csv = require("csv-parser")
const mongoose = require('mongoose');
const db = mongoose.connection;


// Get all artists
router.get('/', async (req, res) => {
    try {
        const result = await db.collection('artists').find().select('artist_id artist_name artist_handle artist_members artist_favorites tags artist_location').toArray();
        res.json(result)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//get artist by id
router.get('/:id', async (req, res) => {
    try {
        const artists = await getArtists()
        if (isNaN(req.params.id)) {
            return res.status(404).json({ errors: [{ msg: 'Enter a number' }] });
        }
        const artist = artists.find(artist => artist.artist_id === req.params.id)
        if (!artist) {
            return res.status(404).json({ errors: [{ msg: 'Artist does not exist' }] });
        }
        //if req.params.id is not a valid number, return error
        //only show first 6 keys for artist
        const artistsKeys = Object.keys(artist)
        const artistsKeysToKeep = artistsKeys.slice(0, 19)
        const artistToReturn = {}
        artistsKeysToKeep.forEach(key => {
            artistToReturn[key] = artist[key]
        })

        res.json(artistToReturn)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});

//get artist by name
router.get('/name/:name', async (req, res) => {
    try {
        const artists = await getArtists()

        //caps dont matter
        const results = artists.find(c => c.artist_name.toLowerCase() === req.params.name.toLowerCase())
        if (!results) {
            return res.status(404).json({ errors: [{ msg: 'Artist does not exist' }] });
        }
        //only show artist_id and artist_name
        const artistToReturn = {}
        artistToReturn.artist_id = results.artist_id
        artistToReturn.artist_name = results.artist_name
        res.json(artistToReturn)

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = { router }