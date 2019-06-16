const request = require('request');

module.exports = locationStr => {
  const result = {};
  return new Promise((resolve, reject) => {
    request.get(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        locationStr +
        '&key=' +
        process.env.GAPI_KEY,
      { json: true },
      (err, response, body) => {
        if (err) console.log(err);
        result.latLng = body.results[0].geometry.location;
        result.formatted_address = body['results'][0].formatted_address;
        resolve(result);
      }
    );
  });
};
