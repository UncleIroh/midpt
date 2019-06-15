const request = require('request');

const isochroneController = {
  generateIsochrones: (req, res, next) => {
    const requestBody = {
      departure_searches: [
        {
          id: 'from point 1',
          coords: res.locals.point1,
          transportation: {
            type: 'driving'
          },
          departure_time: req.body.departureTime,
          travel_time: 600, // time in seconds!!!
          properties: ['is_only_walking']
        },
        {
          id: 'from point 2',
          coords: res.locals.point2,
          transportation: {
            type: 'driving'
          },
          departure_time: req.body.departureTime,
          travel_time: 600 // time in seconds!!!
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
          'X-Application-Id': 'b964c4d6',
          'X-Api-Key': '16b45f2e5a3a3d8424fb455002789d46'
        },
        url: 'https://api.traveltimeapp.com/v4/time-map',
        body: JSON.stringify(requestBody)
      },
      function(error, response, isochroneResult) {
        res.locals.isochronePoints = JSON.parse(
          isochroneResult
        ).results[0].shapes[0].shell;
        console.log(res.locals.isochronePoints);
      }
    );
    return next();
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
    isochronePoints: [
      { lat: 40.72905692, lng: -74.04842126 },
      { lat: 40.73085548, lng: -74.04662269999999 },
      { lat: 40.73265404, lng: -74.04662269999999 },
      { lat: 40.7344526, lng: -74.04842126 },
      { lat: 40.73804972, lng: -74.04842126 },
      { lat: 40.738949, lng: -74.04752198 },
      { lat: 40.738949, lng: -74.04392485999999 },
      { lat: 40.74254612, lng: -74.04032774 },
      { lat: 40.74074756, lng: -74.03852918 },
      { lat: 40.74074756, lng: -74.03493205999999 },
      { lat: 40.73715044, lng: -74.03133494 },
      { lat: 40.73715044, lng: -74.02773782 },
      { lat: 40.73625116, lng: -74.02683854 },
      { lat: 40.73535188, lng: -74.02773782 },
      { lat: 40.73535188, lng: -74.02953638 },
      { lat: 40.7344526, lng: -74.03043566 },
      { lat: 40.72905692, lng: -74.03043566 },
      { lat: 40.72456052, lng: -74.03493205999999 },
      { lat: 40.72456052, lng: -74.03673061999999 },
      { lat: 40.72366124, lng: -74.0376299 },
      { lat: 40.72186268, lng: -74.03583133999999 },
      { lat: 40.71826556, lng: -74.03583133999999 },
      { lat: 40.71736628, lng: -74.03673061999999 },
      { lat: 40.71736628, lng: -74.04212629999999 },
      { lat: 40.71826556, lng: -74.04302557999999 },
      { lat: 40.720064119999996, lng: -74.04302557999999 },
      { lat: 40.7209634, lng: -74.04392485999999 },
      { lat: 40.7209634, lng: -74.04752198 },
      { lat: 40.72186268, lng: -74.04842126 },
      { lat: 40.72905692, lng: -74.04842126 }
    ]
  }
};

isochroneController.generateIsochrones(req, res, () => {
  console.log('next called');
});
