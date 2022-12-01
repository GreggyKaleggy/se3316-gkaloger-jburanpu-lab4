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

    desc: {
        type: String
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
    }],

    reviews:
        [{
            hidden: { Boolean },
            stars: { Number },
            review: { String }
        }]

});
module.exports = List = mongoose.model('list', listSchema);