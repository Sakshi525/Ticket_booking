const express = require('express');
const router = express.Router();
const Station = require('../models/station');

// API endpoints
router.post('/create-stations', async (req, res) => {
    try {
        const { name, id } = req.body;
        const station = new Station({ name, id });
        await station.save();
        res.status(201).json(station);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/list-of-stations', async (req, res) => {
    try {
        const stations = await Station.find();
        res.json(stations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/update-stations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedStation = await Station.findOneAndUpdate({ id }, { name }, { new: true });
        res.json(updatedStation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/delete-stations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Station.findOneAndDelete({ id });
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;