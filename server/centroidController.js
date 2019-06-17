const centroidController = {
  getCentroid: (req, res, next) => {
    // find the centroid of a polygon defined by these lat & lng points as vertices.
    // rounded to 7 decimal places.
    // formula: (p1 + ... + pn) / numPoints
    console.log(res.locals.isoIntersectionPoints);
    let centroid;
    res.locals.midpt = [];
    const latLngArr = res.locals.isoIntersectionPoints;
    if (latLngArr.length === 0) {
      return 'error ! no intersection found :/ fairTime is probably calculated wrong';
    }
    isoIntersectionPoints.forEach(el => {
      centroid = el.reduce(
        (acc, cur) => {
          acc.lat += cur.lat / el.length;
          acc.lng += cur.lng / el.length;
          return acc;
        },
        { lat: 0, lng: 0 }
      );
      res.locals.midpt.push({
        lat: Math.round(10000000 * centroid.lat) / 10000000,
        lng: Math.round(10000000 * centroid.lng) / 10000000
      });
    })
    let promArr = [];
    let resArr = [];
    for(let i = 0; i < res.locals.midpt.length; i++){
      for(let j = 0; j < 2; j++){
      promArr.push(
        new Promise((resolve, reject) => {
          const thisPt = res.locals.points[j % res.locals.points.length];
          request.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=
            ${thisPt.lat},${thisPt.lng}
            &destination=${res.locals.midpt[j].lat},${res.locals.midpt[j].lng}
            &departure_time=${res.locals.departureTimeUNIX}
            &key=AIzaSyAIPJHK2bZuPPvTrXqf7C_pcZt_Kbft4ZA`,
            (err, res, body) => {
              if (err) console.log(err);
              resolve(
                JSON.parse(body).routes[0].legs[0].duration_in_traffic.value
              );
            }
          );
        }).then(response => resArr.push(response))
      );
    }
  }
  Promise.all(promArr).then(() => {
    let min = Infinity;
    let bestTracker = 0;
    for(let i = 0; i < resArr.length; i += 2){
      if(resArr[i] + resArr[i + 1] < min) 
      {
        min = resArr[i] + resArr[i + 1];
        bestTracker = i/2;
      }
    }
    res.locals.isoIntersectionPoints = res.locals.isoIntersectionPoints[bestTracker];
  });
    console.log('midpoint found ! ', res.locals.midpt); //for testing
    next();
  }
};

module.exports = centroidController;
