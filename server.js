const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./controllers/routelist');
const apiStation = require('./controllers/station');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/city_transport', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

//API routes
app.use('/api-routes', apiRoutes);
app.use('/api-station', apiStation);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
