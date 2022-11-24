const express = require('express');
const router = express.Router();
const fs = require('fs')
const csv = require("csv-parser")
const { getTracks } = require('./tracks')

const getGenres = () => {
    const genres = []
    return new Promise((resolve) => {
        fs.createReadStream('data/genres.csv')
            .pipe(csv({}))
            .on('data', (data) => genres.push(data))
            .on('end', () => {
                resolve(genres)
            });
    })
}

//get all genres
router.get('/', async (req, res) => {
    try {
        console.log('working')
        const genres = await getGenres()
        res.json(genres)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = { router, getGenres }
