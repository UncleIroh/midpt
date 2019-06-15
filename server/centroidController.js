const centroidController = {
  getCentroid: (req, res, next) => {
    // find the centroid of a polygon defined by these lat & lng points as vertices.
    // rounded to 7 decimal places.
    // formula: (p1 + ... + pn) / numPoints
    const latLngArr = res.locals.isochronePoints;
    if (latLngArr.length === 0) {
      return 'error ! no intersection found :/ fairTime is probably calculated wrong';
    }
    const centroid = latLngArr.reduce(
      (acc, cur) => {
        acc.lat += cur.lat / latLngArr.length;
        acc.lng += cur.lng / latLngArr.length;
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    res.locals.midpt = {
      lat: Math.round(10000000 * centroid.lat) / 10000000,
      lng: Math.round(10000000 * centroid.lng) / 10000000
    };
    console.log('centroid: ', res.locals.midpt); //for testing
    next();
  }
};

module.exports = centroidController;

/// TESTING STUFF

const req = {
  body: {
    points: ['Venice, CA', 'Santa Monica, CA'],
    departureTime: '2019-06-15T08:00:00Z'
  }
};
const res = {
  locals: {
    point1: { lat: 40.7127764, lng: -74.003246 },
    point2: { lat: 47.6153243, lng: -122.3523425 },
    midpt: { lat: 40.7296864, lng: -74.0393985 },
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
centroidController.getCentroid(null, res, () => {
  console.log('next called');
});
