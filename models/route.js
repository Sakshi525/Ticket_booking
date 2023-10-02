const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    fromStation: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
    toStation: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('Route', routeSchema);
