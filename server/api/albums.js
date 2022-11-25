const express = require('express');
const router = express.Router();
const fs = require('fs')
const mongoose = require('mongoose');
const db = mongoose.connection;


//get all albums
router.get('/', async (req, res) => {
    try {
        const result = await db.collection('albums').find().toArray();
        res.json(result);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = { router };
