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
        trackID: { type: Number },
        trackduration: { type: Number }
    }],
    reviews:
        [{
            hidden: { Boolean },
            username: { String },
            stars: { Number },
            review: { String }
        }],
    modified: {
        type: Date,
        default: Date.now
    },
    isPrivate: {
        type: Boolean
    }

});
module.exports = List = mongoose.model('list', listSchema);