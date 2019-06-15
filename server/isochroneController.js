const request = require('request');
require('dotenv').config();

const isochroneController = {};

isochroneController.generateIsochrones = (req, res, next) => {
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
};

isochroneController.getCoords = (req, res, next) => {
  //retrieve location data from req.body and parse
  console.log(process.env.GAPI_KEY);
  let promArr = [];
  for (let i = 0; i < 2; i++) {
    let parsedStr = req.body['points'][i]['address'].replace(' ', '+');
    //make a fetch request to API
    let promise = new Promise((resolve, reject) => {
      request.get(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          parsedStr +
          '&key=' +
          GAPI_KEY,
        { json: true },
        (err, response, body) => {
          if (err) console.log(err);
          res.locals[`point${i + 1}`] =
            body['results'][0]['geometry']['location'];
          res.locals[`address${i + 1}`] = body['results'];
          resolve();
        }
      );
    });
    promArr.push(promise);
  }
  Promise.all(promArr).then(() => next());
};

isochroneController.generateRoutes = (req, res, next) => {
  let time1;
  let time2;
  const promArr = [];
  promArr.push(
    new Promise((resolve, reject) => {
      request.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=
		${res.locals.point1.lat},${res.locals.point1.lng}
		&destinations=${res.locals.point2.lat},${res.locals.point2.lng}
		&key=` + GAPI_KEY,
        (err, res, body) => {
          if (err) console.log(err);
          time1 = JSON.parse(body)['rows'][0]['elements'][0]['duration'][
            'value'
          ];
        }
      );
      resolve(time1);
    })
  );
  promArr.push(
    new Promise((resolve, reject) => {
      request.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=
	${res.locals.point2.lat},${res.locals.point2.lng}
	&destinations=${res.locals.point1.lat},${res.locals.point1.lng}
	&key=` + GAPI_KEY,
        (err, res, body) => {
          if (err) console.log(err);

          time2 = JSON.parse(body)['rows'][0]['elements'][0]['duration'][
            'value'
          ];
          resolve(body);
        }
      );
    })
  );
  //do the promise thing
  Promise.all(promArr).then(() => {
    (res.locals.fairTime = Math.ceil((1 - time1 / (time1 + time2)) * time1)),
      next();
  });
};

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

module.exports = isochroneController;
