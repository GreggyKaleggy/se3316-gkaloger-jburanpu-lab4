const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require("csv-parser");
const { getAlbums } = require('./albums');


const getTracks = () => {
    const tracks = []
    return new Promise((resolve) => {
        fs.createReadStream('data/raw_tracks.csv')
            .pipe(csv({}))
            .on('data', (data) => tracks.push(data))
            .on('end', () => {
                resolve(tracks)
            });
    })
}

//route for /api/tracks
router.get('/', async (req, res) => {
    try {
        console.log('working')
        const tracks = await getTracks()
        res.json(tracks)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


//Getting the details needed given the 
router.get('/:id', async (req, res) => {
    try {
        if (isNaN(req.params.id)) {
            return res.status(404).json('Track ID must be an integer');
        }
        if (req.params.id > 10000000) {
            return res.status(404).json({ errors: [{ msg: 'Enter a valid ID' }] })
        }

        const tracks = await getTracks()
        const track = tracks.find(track => track.track_id === req.params.id)
        if (!track) {
            return res.status(404).json({ errors: [{ msg: 'Track not found' }] });
        }
        const { album_id, album_title, artist_id, artist_name, tags, track_date_created, track_date_recorded, track_duration, track_genres, track_number, track_title } = track
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
        const tracks = await getTracks()
        const search = req.params.title
        const searchResults = []

        //if search is too long, prompt user to enter a shorter search term
        if (search.length > 10) {
            return res.status(404).json({ errors: [{ msg: 'Please enter a shorter search term' }] });
        }
        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].track_title.includes(search) || tracks[i].album_title.includes(search)) {
                //push track_id and track_title and album title to searchResults
                //only show first 20 results
                if (searchResults.length < 20) {
                    searchResults.push({ track_id: tracks[i].track_id, track_title: tracks[i].track_title, album_title: tracks[i].album_title })
                }
            }
        }
        if (searchResults.length === 0) {
            return res.status(404).json({ errors: [{ msg: 'No tracks with that search' }] });
        }
        res.json(searchResults)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = { router, getTracks }
