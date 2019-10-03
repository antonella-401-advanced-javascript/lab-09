// eslint-disable-next-line new-cap
const router = require('express').Router();
const Tour = require('../models/tour');
const addGeo = require('../middleware/add-geolocation');
const addWeather = require('../middleware/add-weather');

router
  .post('/', (req, res, next) => {
    Tour.create(req.body)
      .then(tour => res.json(tour))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Tour.find()
      .lean()
      .then(tour => res.json(tour))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Tour.findById(req.params.id)
      .lean()
      .then(tours => res.json(tours))
      .catch(next);
  })

  .post('/:id/stops', addGeo(), addWeather(), (req, res, next) => {
    Tour.addStop(req.params.id, req.body.location, req.body.weather)
      .then(stop => res.json(stop))
      .catch(next);
  })

  .put('/:id/stops/:stopId/attendance', ({ params, body }, res, next) => {
    Tour.updateStopAttendance(params.id, params.stopId, body.attendance)
      .then(stop => res.json(stop))
      .catch(next);
  })

  .delete('/:id/stops/:stopId', ({ params }, res, next) => {
    Tour.removeStop(params.id, params.stopId)
      .then(stop => res.json(stop))
      .catch(next);
  });

module.exports = router;