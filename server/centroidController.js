const centroidController = {
  getCentroid: (req, res, next) => {
    // find the centroid of a polygon defined by these lat & lng points as vertices.
    // rounded to 7 decimal places.
    // formula: (p1 + ... + pn) / numPoints
    const latLngArr = res.locals.isoIntersectionPoints;
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
    console.log('midpoint found ! ', res.locals.midpt); //for testing
    next();
  }
};

module.exports = centroidController;
