jest.mock('../../lib/services/maps-api');
jest.mock('../../lib/services/weather-api');
const request = require('../request');
const db = require('../db');
const getLocation = require('../../lib/services/maps-api');
const getForecast = require('../../lib/services/weather-api');

getLocation.mockResolvedValue({
  latitude: 45.5266975,
  longitude: -122.6880503
});

getForecast.mockResolvedValue({
  time: new Date(),
  forecast: 'sad weather'
});

describe('tours api', () => {
  beforeEach(() => {
    return db.dropCollection('tours');
  });

  // const location = {
  //   name: 'Testing location',
  //   address: '97230'
  // };

  // const attendance = {
  //   attendance: 2
  // };

  const testTour = {
    title: 'Testing Tour',
    activities: ['Test1', 'Test2', 'Test3'],
    launchDate: new Date(),
    stops: [{}]
  };

  function postTour(tour) {
    return request
      .post('/api/tours')
      .send(tour)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a tour', () => {
    return postTour(testTour).then(tour => {
      expect(tour).toMatchInlineSnapshot(
        {
          // _id: expect.any(String),
          // __v: 0,
          // launchDate: expect.any(Date),
          // stops: [{
          //   _id: expect.any(String)
          // }]
        },
        `
        Object {
          "__v": 0,
          "_id": "5d953194b8fb854cba2c3605",
          "activities": Array [
            "Test1",
            "Test2",
            "Test3",
          ],
          "launchDate": "2019-10-02T23:24:04.250Z",
          "stops": Array [
            Object {
              "_id": "5d953194b8fb854cba2c3606",
            },
          ],
          "title": "Testing Tour",
        }
      `
      );
    });
  });
});
