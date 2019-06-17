const request = require('request');
require('dotenv').config();
const isochrone = require('./isochrone');
const turf = require('@turf/turf');
const geocode = require('./geocode');

const isochroneController = {};

isochroneController.getCoords = (req, res, next) => {
  //retrieve location data from req.body and parse
  res.locals.addresses = [];
  res.locals.points = [];
  const dateObj = new Date();
  res.locals.departureTimeISO = dateObj.toISOString(); // for time travel api
  res.locals.departureTimeUNIX = Math.round(dateObj.valueOf() / 1000);
  // console.log('reqbody', req.body);
  let promArr = [];
  for (let i = 0; i < 2; i++) {
    let parsedStr = req.body['points'][i].replace(' ', '+');
    //make a fetch request to API
    promArr.push(geocode(parsedStr));
  }
  Promise.all(promArr)
    .then(ptsAddresses => {
      ptsAddresses.forEach(ptAddressObj => {
        res.locals.addresses.push(ptAddressObj.formatted_address);
        res.locals.points.push(ptAddressObj.latLng);
      });
      return next();
    })
    .catch(err => {
      res.status(404).json(err);
    });
};

isochroneController.generateRoutes = (req, res, next) => {
  let time1;
  let time2;
  const promArr = [];
  for (let i = 0; i < 2; i++) {
    promArr.push(
      new Promise((resolve, reject) => {
        const thisPt = res.locals.points[i % res.locals.points.length];
        const otherPt = res.locals.points[(i + 1) % res.locals.points.length];
        request.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=
          ${thisPt.lat},${thisPt.lng}
          &destination=${otherPt.lat},${otherPt.lng}
          &departure_time=${res.locals.departureTimeUNIX}
          &key=` + process.env.GAPI_KEY,
          (err, res, body) => {
            if (err) console.log(err);
            resolve(
              JSON.parse(body).routes[0].legs[0].duration_in_traffic.value
            );
          }
        );
      })
    );
  }
  //do the promise thing
  Promise.all(promArr).then(values => {
    console.log(
      'finding a midpt between ',
      res.locals.addresses[0],
      ' and ',
      res.locals.addresses[1]
    );
    console.log('user1 travel time is ', values[0] / 60);
    console.log('user2 travel time is ', values[1] / 60);
    (res.locals.fairTime = Math.ceil(
      (1 - values[0] / (values[0] + values[1])) * values[0]
    )),
      next();
  });
};

isochroneController.generateIsochronesSHITTYwithGOOGLE = (req, res, next) => {
  // console.log('res locals', res.locals);
  isochrone.load({
    map: 'theMap',
    key: process.env.GAPI_KEY, // Do change the key: it won't work on your domain anyway :-)
    callback: function(iso) {
      //placeholder
    },
    debug: true
  });
  let friendIsochrones = [];
  async function tryIntersection(time) {
    let curIntersection = null;
    let timeToTry = time;
    while (!curIntersection) {
      timeToTry = timeToTry * 1.2;
      console.log(
        'trying isochrome intersection with a fairTime of ',
        timeToTry / 60
      );
      friendIsochrones = [];
      for (let i = 0; i < 2; i++) {
        friendIsochrones.push(
          await new Promise((resolve, reject) => {
            isochrone.compute({
              lat: res.locals.points[i].lat,
              lng: res.locals.points[i].lng,
              cycles: 5,
              slices: 100,
              type: 'duration',
              value: timeToTry,
              mode: 'driving',
              key: process.env.GAPI_KEY,
              callback: function(status, points) {
                if (status === 'OK') {
                  const curIsochrone = [];
                  for (let pt of points) {
                    curIsochrone.push([pt.lat, pt.lng]);
                  }
                  curIsochrone.push(curIsochrone[0]);
                  resolve(turf.polygon([curIsochrone]));
                }
              }
            });
          })
        );
      }
      curIntersection = turf.intersect(
        friendIsochrones[0],
        friendIsochrones[1]
      );
      // timeToTry = timeToTry * 1.2;
    }
    res.locals.isochrones = [];
    for (let i = 0; i < 2; i += 1) {
      res.locals.isochrones.push(
        friendIsochrones[i].geometry.coordinates[0].map(point => {
          return { lat: point[0], lng: point[1] };
        })
      );
    }
    console.log(curIntersection);
    let coords = curIntersection.geometry.coordinates;
    if (curIntersection.geometry.type === 'Polygon') {
      res.locals.isoIntersectionPoints = coords[0].map(el => {
        return { lat: el[0], lng: el[1] };
      });
    } else {
      console.log('its a muli', coords[0]);
      res.locals.isoIntersectionPoints = coords.map(el => {
        return { lat: el[0], lng: el[1] };
      });
    }
    // console.log('intersection found!!!!', res.locals.isoIntersectionPoints);
    next();
  }

  tryIntersection(res.locals.fairTime);
};

isochroneController.generateIsochrones = (req, res, next) => {
  let friendIsochrones = [];
  async function tryIntersection(time) {
    let curIntersection = null;
    let timeToTry = time;
    while (!curIntersection) {
      timeToTry = timeToTry * 1.2;
      // timeToTry = 1500;
      console.log(
        'trying isochrome intersection with a fairTime of ',
        timeToTry
      );
      friendIsochrones = [];
      for (let i = 0; i < 2; i++) {
        friendIsochrones.push(
          await new Promise((resolve, reject) => {
            const thisPt = res.locals.points[i % res.locals.points.length];
            request.get(
              `https://dev.virtualearth.net/REST/v1/Routes/Isochrones?` +
                `dateTime=06/17/2019` +
                `&waypoint=${thisPt.lat},${thisPt.lng}` +
                `&maxTime=${timeToTry}` +
                `&distanceUnit=mile` +
                `&optimize=timeWithTraffic` +
                `&travelMode=driving` +
                `&key=${process.env.BING_KEY}`,
              (err, res, body) => {
                if (err) console.log(err);
                console.log(JSON.parse(body));
                const arrayOfLatLngPoints = JSON.parse(body).resourceSets[0]
                  .resources[0].polygons[0].coordinates[0];
                // sometimes it might not be one polygon!!! so would need to have multiple i's for coordinates
                resolve(turf.polygon([arrayOfLatLngPoints]));
              }
            );
          })
        );
      }
      curIntersection = turf.intersect(
        friendIsochrones[0],
        friendIsochrones[1]
      );
      // timeToTry = timeToTry * 1.2;
    }
    res.locals.isochrones = [];
    for (let i = 0; i < 2; i += 1) {
      res.locals.isochrones.push(
        friendIsochrones[i].geometry.coordinates[0].map(point => {
          return { lat: point[0], lng: point[1] };
        })
      );
    }
    console.log(curIntersection);
    let coords = curIntersection.geometry.coordinates;
    res.locals.isoIntersectionPoints = [];
    if (curIntersection.geometry.type === 'Polygon') {
      console.log('its a poly', coords);
      res.locals.isoIntersectionPoints.push(
        coords[0].map(el => {
          return { lat: el[0], lng: el[1] };
        })
      );
    } else {
      console.log('its a multi');
      for (let i = 0; i < coords.length; i++) {
        res.locals.isoIntersectionPoints.push(
          coords[i][0].map(el => {
            return { lat: el[0], lng: el[1] };
          })
        );
      }
      // console.log(res.locals.isoIntersectionPoints);
    }
    // console.log('intersection found!!!!', res.locals.isoIntersectionPoints);
    next();
  }

  tryIntersection(res.locals.fairTime);
};

module.exports = isochroneController;

//'https://dev.virtualearth.net/REST/v1/Routes/Isochrones?dateTime=06/17/2019&waypoint=34.147449,-118.144272&maxTime=1800&distanceUnit=mile&optimize=timeWithTraffic&travelMode=driving&key=AsTqvk3W-QPHFNCKKAXlTdy7z_3C46CUXGV0sNMQj2XSjGsD6tOnk7dr3dd_f4BB');
