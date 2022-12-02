const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: true
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
    },
    validated: {
        type: Boolean,
        default: false
    }
});

module.exports = User = mongoose.model('user', UserSchema);