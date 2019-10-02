// eslint-disable-next-line new-cap
const router = require('express').Router();
const Tour = require('../models/tour');
// const addGeo = require('../middleware/add-geolocation');
// const addWeather = require('../middleware/add-weather');

router
  .post('/', (req, res, next) => {
    Tour.create(req.body)
      .then(tour => res.json(tour))
      .catch(next);
  });

module.exports = router;