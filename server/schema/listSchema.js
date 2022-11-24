const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    duration: {
        type: Number
    },

    numberofTracks: {
        type: Number
    },

    tracklist: [{
        trackID: {
            type: Number
        },
        trackduration: {
            type: Number
        }
    }]
});
module.exports = List = mongoose.model('list', listSchema);