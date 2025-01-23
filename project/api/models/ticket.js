const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    price: Number
}, { versionKey: false });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
