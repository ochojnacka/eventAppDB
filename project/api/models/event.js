const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: String,
    location: String,
    date: Date,
    categories: [{
        name: String
    }]
}, { versionKey: false });

module.exports = mongoose.model('Event', eventSchema);