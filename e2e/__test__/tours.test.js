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

  const testTour = {
    title: 'Testing Tour',
    activities: ['Test1', 'Test2', 'Test3'],
    launchDate: new Date(),
    stops: [{}]
  };

  const testLocation = {
    name: 'Rontoms',
    address: '600 E Burnside St, Portland, OR'
  };

  const testAttendance = {
    attendance: 24
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

  it('adds a stop to the tour', () => {
    return postTour(testTour)
      .then(tour => {
        return request
          .post(`/api/tours/${tour._id}/stops`)
          .send(testLocation)
          .expect(200)
          .then(body => {
            return [body, testLocation, testLocation];
          });
      })
      .then(out => {
        const stop = out[0].body[1];
        expect(stop).toMatchInlineSnapshot(
          {
            _id: expect.any(String)
          },
          `
          Object {
            "_id": Any<String>,
          }
        `
        );
      });
  });

  it('updates stop attendance', () => {
    return postTour(testTour)
      .then(tour => {
        return request
          .post(`/api/tours/${tour._id}/stops`)
          .send(testLocation)
          .expect(200)
          .then(out => {
            const stops = out.body[0];
            return request
              .put(`/api/tours/${tour._id}/stops/${stops._id}/attendance`)
              .send(testAttendance)
              .expect(200)
              .then(({ body }) => {
                expect(body[0].attendance).toBe(24);
              });
          });
      });
  });

  it('deletes a stop', () => {
    return postTour(testTour)
      .then(tour => {
        return request
          .post(`/api/tours/${tour._id}/stops`)
          .send(testLocation)
          .expect(200)
          .then(out => {
            const stops = out.body[1];
            return request
              .delete(`/api/tours/${tour._id}/stops/${stops._id}`)
              .send(tour._id, stops._id)
              .expect(200);
          });
      });
  });
});
