const express = require('express');
const router = express.Router();
const fs = require('fs')
const csv = require("csv-parser")


const getAlbums = () => {
    const albums = []
    return new Promise((resolve) => {
        fs.createReadStream('data/raw_albums.csv')
            .pipe(csv({}))
            .on('data', (data) => albums.push(data))
            .on('end', () => {
                resolve(albums)
            });
    })
}

//get all albums
router.get('/', async (req, res) => {
    try {
        console.log('working')
        const albums = await getAlbums()
        res.json(albums)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = { router, getAlbums };
