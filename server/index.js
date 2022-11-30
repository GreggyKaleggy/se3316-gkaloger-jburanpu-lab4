const express = require('express')
const app = express();
const cors = require('cors');
const { response } = require('express');
const path = require('path');
const connectToDatabase = require('./db');

connectToDatabase();




app.use(cors());
app.use('/api/albums', require('./api/albums.js').router)
app.use('/api/artists', require('./api/artists').router);
app.use('/api/genres', require('./api/genres.js').router);
app.use('/api/tracks', require('./api/tracks').router)
app.use('/api/lists', require('./api/lists').router);
app.use('/api/users', require('./api/users').router);
app.use('/api/auth', require('./auth/auth').router);



app.use(express.static(path.join(__dirname, '../client')));

app.get('*', (req, res) => {
    res.sendFile
        (path.join(__dirname + '../client/index.html'));
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`));


