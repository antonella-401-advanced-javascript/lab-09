const express = require('express');
const app = express();
// Load model plugins
require('./models/register-plugins');

// MIDDLEWARE
const morgan = require('morgan');
const checkConnection = require('./middleware/check-connection');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use(checkConnection());

// IS ALIVE TEST
app.get('/hello', (req, res) => res.send('world'));

// API ROUTES
const cats = require('./routes/cats');
const shows = require('./routes/shows');
const locations = require('./routes/locations');
const vetVisits = require('./routes/vet-visits');
app.use('/api/cats', cats);
app.use('/api/shows', shows);
app.use('/api/locations', locations);
app.use('/api/vet-visits', vetVisits);

// NOT FOUND
const api404 = require('./middleware/api-404');
const html404 = require('./middleware/html-404');
app.use('/api', api404);
app.use(html404);

// ERRORS
const errorHandler = require('./middleware/error-handler');
app.use(errorHandler);

module.exports = app;