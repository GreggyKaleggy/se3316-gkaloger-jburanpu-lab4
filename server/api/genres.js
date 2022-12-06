const express = require('express');
const router = express.Router();
const fs = require('fs')
const csv = require("csv-parser")
const { getTracks } = require('./tracks')
const mongoose = require('mongoose');
const db = mongoose.connection;


//@route    GET api/genres
//@desc     GET request to get all genres - from lab 3 and not used
//@access   Public
router.get('/', async (req, res) => {
    try {
        const result = await db.collection('genres').find().toArray();
        res.json(result)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = { router }
