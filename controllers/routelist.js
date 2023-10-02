const express = require('express');
const router = express.Router();
const Route = require('../models/route');
const crypto = require('crypto');

// Middleware to check if a valid route exists between fromStation and toStation
async function validateRoute(req, res, next) {
    const { fromStation, toStation } = req.body;
    try {
        const route = await Route.findOne({ fromStation, toStation });
        if (!route) {
            return res.status(400).json({ message: 'No valid route found for the given stations.' });
        }
        req.route = route; // Store the route in the request object for later use
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Generate a ticket based on from and to stations
router.post('/generate-ticket', validateRoute, async (req, res) => {
    const { fromStation, toStation } = req.body;
    const route = req.route;

    try {
        const ticketHash = generateTicketHash(route);
        const currentTime = new Date();
        const validityTime = new Date(currentTime.getTime() + 150 * 60 * 1000);
        const ticket = {
            From: fromStation,
            To: toStation,
            Price: route.price,
            TicketHash: ticketHash,
            ValidFrom: currentTime,
            ValidTo: validityTime,
        };
        res.status(200).json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Validate a ticket based on its hash
router.post('/validate-ticket', async (req, res) => {
    const { ticketHash } = req.body;
    try {
        // Implement ticket validation logic here, assuming you have a Ticket model
        const ticket = await Ticket.findOne({ hash: ticketHash });
        if (!ticket) {
            return res.status(400).json({ message: 'Invalid ticket hash.' });
        }
        const currentTime = new Date();
        if (currentTime >= ticket.ValidFrom && currentTime <= ticket.ValidTo) {
            res.status(200).json({ valid: true });
        } else {
            res.status(200).json({ valid: false });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Helper function to generate a unique ticket hash
function generateTicketHash(route) {
    const hash = crypto.createHash('sha256');
    hash.update(`${route.fromStation}-${route.toStation}-${route.price}-${Date.now()}`);
    return hash.digest('hex');
}

// Get a list of routes
router.get('/list-of-routes', async (req, res) => {
    try {
        const routes = await Route.find().populate('fromStation toStation');
        res.json(routes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new route
router.post('/create-routes', async (req, res) => {
    try {
        const { fromStation, toStation, price } = req.body;
        const route = new Route({ fromStation, toStation, price });
        await route.save();
        res.status(201).json(route);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
