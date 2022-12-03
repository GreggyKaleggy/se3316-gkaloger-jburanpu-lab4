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
    username: {
        type: String,
        ref: 'user'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    desc: {
        type: String
    },
    numberofTracks: {
        type: Number
    },
    tracklist: [{
        track_id: { type: Number },
        trackduration: { type: Number },
        track_title: { type: String },
        artist_name: { type: String },
        track_genres: { type: String }
    }],
    averageRating: {
        type: Number
    },
    reviews:
        [{
            hidden: Boolean,
            username: String,
            rating: Number,
            review: String,
            date: {
                type: Date,
                default: Date.now
            }
        }],
    modified: {
        type: Date,
        default: Date.now
    },
    isPrivate: {
        type: Boolean,
        default: true
    }

});
module.exports = List = mongoose.model('list', listSchema);