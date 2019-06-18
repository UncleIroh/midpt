const centroidController = {
  getCentroid: (req, res, next) => {
    // find the centroid of a polygon defined by these lat & lng points as vertices.
    // rounded to 7 decimal places.
    // formula: (p1 + ... + pn) / numPoints
    // console.log(res.locals.isoIntersectionPoints);
    let centroid; //Centroid will be the midpoint of each isochrone, calculated on 14-18
    res.locals.midpt = []; //will contain all centroids
    const latLngArr = res.locals.isoIntersectionPoints; //reduces total characters, not necessary
    if (latLngArr.length === 0) {
      //checks if we have an isochrone intersection. We should always have an isochrone intersection
      return 'error ! no intersection found :/ fairTime is probably calculated wrong';
    }
    latLngArr.forEach(el => {
      //since latLngArr is an array of arrays of objects, we need to go through the layers
      centroid = el.reduce(
        (acc, cur) => {
          //this block takes the mean of both latitude and longitude of each isochrone in latLngArr, and stores each one in centroid
          acc.lat += cur.lat / el.length;
          acc.lng += cur.lng / el.length;
          return acc;
        },
        { lat: 0, lng: 0 }
      );
      //with each centroid calculated, we shave off the bad rounding, and store them in the array res.locals.midpt
      res.locals.midpt.push({
        lat: Math.round(10000000 * centroid.lat) / 10000000,
        lng: Math.round(10000000 * centroid.lng) / 10000000
      });
    })
    let promArr = [];
    let resArr = [];
    //This block is to evaluate which centroid in res.locals.midpt is most efficient for both users
    for(let i = 0; i < res.locals.midpt.length; i++){
      for(let j = 0; j < 2; j++){
      promArr.push(
        new Promise((resolve, reject) => {
          const thisPt = res.locals.points[j % res.locals.points.length];
          //what we are doing here is retrieving the time value from each start point to each destination
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
          //after retrieving the time value, we store it in resArr
        }).then(response => resArr.push(response))
      );
    }
  }
  Promise.all(promArr).then(() => {
    //once all time values have been retrieved, we iterate over them to find the best pair
    let min = Infinity;
    let bestTracker = 0;
    for(let i = 0; i < resArr.length; i += 2){
      if(resArr[i] + resArr[i + 1] < min) 
      {
        min = resArr[i] + resArr[i + 1];
        bestTracker = i/2;
      }
    }
    //Overwrite the composite arrays with the best array, to facillitate passing it back to the front end
    res.locals.isoIntersectionPoints = latLngArr[bestTracker];
  });
    console.log('midpoint found ! ', res.locals.midpt[bestTracker]); //for testing
    next();
  }
};

module.exports = centroidController;
