const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    fromStation: String,
    toStation: String,
    price: Number,
});

module.exports = mongoose.model('Route', routeSchema);
