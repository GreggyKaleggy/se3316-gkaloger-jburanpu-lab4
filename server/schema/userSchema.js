const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    deactivated: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = User = mongoose.model('user', UserSchema);