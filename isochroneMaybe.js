const grid = require('@turf/point-grid');
const bbox = require('@turf/bbox');
const destination = require('@turf/destination');
const point = require('@turf/helpers').point;
const distance = require('@turf/distance');
const featureCollection = require('@turf/helpers').featureCollection;
const gDistance = require('google-distance-matrix');
require('dotenv').config();
gDistance.key(process.env.GAPI_KEY);
gDistance.units('imperial');
gDistance.traffic_model('best_guess');
gDistance.departure_time(Math.round(new Date().valueOf() / 1000));
gDistance.mode('driving');

const time = 300; // 300 second drivetime (5 minutes)
const origin = [-118.4965129, 34.0250724]; // center point
// Note: coordinates are E/W , N/S
const options = {
  resolution: 25, // sample resolution
  maxspeed: 70, // in 'unit'/hour
  unit: 'miles' // 'miles' or 'kilometers'
};

isochrone(origin, time, options);

function isochrone(center, time, options) {
  // compute bboxGrid
  // bboxGrid should go out 1.4 miles in each direction for each minute
  // this will account for a driver going a bit above the max safe speed
  var unit = { unit: options.unit };
  var centerPt = point(center);
  var spokes = featureCollection([]);
  var length = (time / 3600) * options.maxspeed;
  spokes.features.push(destination(centerPt, length, 180, unit));
  spokes.features.push(destination(centerPt, length, 0, unit));
  spokes.features.push(destination(centerPt, length, 90, unit));
  spokes.features.push(destination(centerPt, length, -90, unit));
  var bboxGrid = bbox(spokes);
  var sizeCellGrid =
    distance(
      point([bboxGrid[0], bboxGrid[1]]),
      point([bboxGrid[0], bboxGrid[3]]),
      unit
    ) / options.resolution;

  //compute destination grid
  var targets = grid(bboxGrid, sizeCellGrid, unit);
  targets.features = targets.features.filter(function(feat) {
    return distance(point(feat.geometry.coordinates), centerPt, unit) <= length;
  });
  var destinations = featureCollection([]);

  var coord = targets.features.map(function(feat) {
    return feat.geometry.coordinates;
  });
  coord.push(center);
  var sources = coord.length - 1;
  // console.log(coord.length);
  coordStr = coord.map(el => `${el[1]},${el[0]}`);
  const originStr = [`${origin[1]},${origin[0]}`];
  // console.log(strOrigin, coord);
  const allDistancePromise = [];
  const numChunks = Math.ceil(coordStr.length / 25);
  for (let i = 0; i < 1; i++) {
    allDistancePromise.push(
      new Promise((resolve, reject) => {
        // console.log('this slice', coord.slice(i * 25, (i + 1) * 25));
        gDistance.matrix(
          [originStr],
          coordStr.slice(i * 25, (i + 1) * 25),
          function(err, distances) {
            const durationsInTraffic = distances.rows[0].elements;
            resolve(durationsInTraffic.map(el => el.duration_in_traffic.value));
            // console.log('err', err);
          }
        );
      })
    );
  }
  Promise.all(allDistancePromise).then(distanceChunks => {
    const allDistancesTogether = distanceChunks.reduce(
      (acc, chunk) => acc.concat(chunk),
      []
    );
    console.log('all distances together', allDistancesTogether);
    allDistancesTogether.forEach(function(time, idx) {
      let distanceMapped = distance(
        point(coord[idx]),
        point(res.destinations[idx].location),
        unit
      );
      if (distanceMapped < sizeCellGrid) {
        let dest = point(res.destinations[idx].location);
        dest.properties = {};
        dest.properties.eta = time;
        destinations.features.push(dest);
      }
    });
  });
}
