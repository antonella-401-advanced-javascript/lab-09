const express = require('express');
const app = express();
// Load model plugins
require('./models/register-plugins');

// MIDDLEWARE
const morgan = require('morgan');
const checkConnection = require('./middleware/check-connection');
app.use(morgan('dev'));
// body parser
app.use(express.json());

app.use(express.static('public'));
app.use(checkConnection());

// IS ALIVE TEST
app.get('/hello', (req, res) => res.send('world'));

// API ROUTES
const tours = require('./routes/tours');
app.use('/api/tours', tours);
// NOT FOUND
const api404 = require('./middleware/api-404');
const html404 = require('./middleware/html-404');
app.use('/api', api404);
app.use(html404);

// ERRORS
const errorHandler = require('./middleware/error-handler');
app.use(errorHandler);

module.exports = app;