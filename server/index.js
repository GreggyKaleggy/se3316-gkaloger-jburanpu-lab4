const express = require('express')
const app = express();
const cors = require('cors');
const connectToDatabase = require('./db');

connectToDatabase();


app.use(cors());
app.use('/api/albums', require('./api/albums.js').router)
app.use('/api/artists', require('./api/artists').router);
app.use('/api/genres', require('./api/genres.js').router);
app.use('/api/tracks', require('./api/tracks').router)
app.use('/api/lists', require('./api/lists').router);
app.use('/api/users', require('./api/users').router);
app.use('/api/admins', require('./api/admins').router);
app.use('/api/docs', require('./api/docs').router);

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Listening on port ${port}`));


