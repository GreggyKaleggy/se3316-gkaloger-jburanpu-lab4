const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    modified: {
        type: Date,
        default: Date.now
    }
});

module.exports = Doc = mongoose.model('doc', DocumentSchema);