const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    stationId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Station', stationSchema);
