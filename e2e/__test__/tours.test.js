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
          _id: expect.any(String),
          launchDate: expect.any(String),
          stops: [
            {
              _id: expect.any(String)
            }
          ]
        },
        `
        Object {
          "__v": 0,
          "_id": Any<String>,
          "activities": Array [
            "Test1",
            "Test2",
            "Test3",
          ],
          "launchDate": Any<String>,
          "stops": Array [
            Object {
              "_id": Any<String>,
            },
          ],
          "title": "Testing Tour",
        }
      `
      );
    });
  });

  it('gets all tours', () => {
    return Promise.all([
      postTour(testTour),
      postTour(testTour),
      postTour(testTour)
    ])
      .then(() => {
        return request.get('/api/tours').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            launchDate: expect.any(String),
            stops: [
              {
                _id: expect.any(String)
              }
            ]
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "activities": Array [
              "Test1",
              "Test2",
              "Test3",
            ],
            "launchDate": Any<String>,
            "stops": Array [
              Object {
                "_id": Any<String>,
              },
            ],
            "title": "Testing Tour",
          }
        `
        );
      });
  });
});
