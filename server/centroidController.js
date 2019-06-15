const centroidController = {
  getCentroid: (req, res, next) => {
    // find the centroid of a polygon defined by these lat & lng points as vertices.
    // rounded to 7 decimal places.
    // formula: (p1 + ... + pn) / numPoints
    const latLngArr = res.locals.isochronePoints;
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
centroidController.getCentroid(null, res, () => {
  console.log('next called');
});
