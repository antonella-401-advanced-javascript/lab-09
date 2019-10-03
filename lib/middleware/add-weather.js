const getForecast = require('../services/weather-api');
const getLocation = require('../services/maps-api');

module.exports = () => (req, res, next) => {
  const { address } = req.body;

  getLocation(address)
    .then(location => {
      if(!location) {
        throw {
          statusCode: 400,
          error: 'address must be resolvable to geolocation'
        };
      }
      req.body.location = location;
      getForecast(location)
        .then(weather => {
          req.body.weather = weather;
          next();
        })
        .catch(next);
    });
};