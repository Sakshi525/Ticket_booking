const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

// Initialize data structures
const stations = [];
const routes = [];

// API to manage stations
app.post('/stations', (req, res) => {
    const { name } = req.body;
    const id = uuidv4();
    stations.push({ id, name });
    res.status(201).json({ id, name });
});

app.get('/stations', (req, res) => {
    res.json(stations);
});

app.put('/stations/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const station = stations.find((s) => s.id === id);
    if (!station) {
        res.status(404).json({ error: 'Station not found' });
    } else {
        station.name = name;
        res.json(station);
    }
});

app.delete('/stations/:id', (req, res) => {
    const { id } = req.params;
    const index = stations.findIndex((s) => s.id === id);
    if (index === -1) {
        res.status(404).json({ error: 'Station not found' });
    } else {
        stations.splice(index, 1);
        res.status(204).end();
    }
});

// API to manage routes
app.post('/routes', (req, res) => {
    const { from, to, price } = req.body;
    routes.push({ from, to, price });
    res.status(201).json({ from, to, price });
});

app.get('/routes', (req, res) => {
    res.json(routes);
});

// Ticket generation and validation
app.post('/tickets', (req, res) => {
    const { from, to } = req.body;
    const route = routes.find((r) => r.from === from && r.to === to);
    if (!route) {
        res.status(404).json({ error: 'Route not found' });
    } else {
        const ticket = {
            from,
            to,
            price: route.price,
            validFrom: new Date().toISOString(),
            validTo: new Date(Date.now() + 150 * 60 * 1000).toISOString(),
            ticketHash: uuidv4(),
        };
        res.status(201).json(ticket);
    }
});

app.get('/tickets/:ticketHash', (req, res) => {
    const { ticketHash } = req.params;
    const ticket = tickets.find((t) => t.ticketHash === ticketHash);
    if (!ticket) {
        res.status(404).json({ error: 'Ticket not found' });
    } else {
        // Validate ticket here based on the validFrom and validTo fields
        const now = new Date();
        if (now >= new Date(ticket.validFrom) && now <= new Date(ticket.validTo)) {
            res.status(200).json({ valid: true, ticket });
        } else {
            res.status(200).json({ valid: false, ticket });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
