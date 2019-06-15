const request = require('request');
require('dotenv').config();

const isochroneController = {
  generateIsochrones: (req, res, next) => {
    const requestBody = {
      departure_searches: [
        {
          id: 'from point 1',
          coords: res.locals.point1,
          transportation: {
            type: 'walking'
          },
          departure_time: req.body.departureTime,
          travel_time: res.locals.fairTime // time in seconds!!!
        },
        {
          id: 'from point 2',
          coords: res.locals.point2,
          transportation: {
            type: 'walking'
          },
          departure_time: req.body.departureTime,
          travel_time: res.locals.fairTime // time in seconds!!!
        }
      ],
      intersections: [
        {
          id: 'union of point1 and point2',
          search_ids: ['from point 1', 'from point 2']
        }
      ]
    };

    request.post(
      {
        headers: {
          'content-type': 'application/json; charset=UTF-8',
          'X-Application-Id': process.env.TIMETRAVEL_APP_ID,
          'X-Api-Key': process.env.TIMETRAVEL_API_KEY
        },
        url: 'https://api.traveltimeapp.com/v4/time-map',
        body: JSON.stringify(requestBody)
      },
      function(error, response, isochroneResult) {
        const shapes = JSON.parse(isochroneResult).results[2].shapes;
        // console.log('full result', shapes);
        if (shapes.length === 0) {
          res.locals.isochronePoints = [];
        } else {
          res.locals.isochronePoints = shapes[0].shell;
        }
        console.log(res.locals.isochronePoints);
        return next();
      }
    );
  }
};

module.exports = isochroneController;

const req = {
  body: {
    points: ['Venice, CA', 'Santa Monica, CA'],
    departureTime: '2019-06-15T08:00:00Z'
  }
};

//ISSUES: lat and long don't give perfect addresses, and instead are super close to them.
const res = {
  locals: {
    point1: { lat: 40.731167, lng: -74.000727 }, // blue note
    point2: { lat: 40.743731, lng: -74.006026 }, // chelsea market
    midpt: { lat: 40.736058, lng: -74.001563 }, // village vanguard
    fairTime: 900,
    isochronePoints: [
      { lat: 40.7353398, lng: -74.00894174000001 },
      { lat: 40.73474564, lng: -74.00834758 },
      { lat: 40.73474564, lng: -74.0029519 },
      { lat: 40.7365442, lng: -74.00115334 },
      { lat: 40.7365442, lng: -73.99935478 },
      { lat: 40.73834276, lng: -73.99755622 },
      { lat: 40.73834276, lng: -73.99665694 },
      { lat: 40.7387924, lng: -73.9962073 },
      { lat: 40.7393624, lng: -73.9962073 },
      { lat: 40.7393624, lng: -73.99682562 },
      { lat: 40.73846312, lng: -73.9977249 },
      { lat: 40.7393624, lng: -73.99862418 },
      { lat: 40.7393624, lng: -74.0022213 },
      { lat: 40.74026168, lng: -74.00312058 },
      { lat: 40.74026168, lng: -74.00491914 },
      { lat: 40.73801348, lng: -74.00716734 },
      { lat: 40.73621492, lng: -74.00716734 },
      { lat: 40.73576528, lng: -74.00761698 },
      { lat: 40.73576528, lng: -74.00851626 },
      { lat: 40.7353398, lng: -74.00894174000001 }
    ]
  }
};

isochroneController.generateIsochrones(req, res, () => {
  console.log('next called');
});
