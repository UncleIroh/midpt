const googleMapsController = {
  // generate two URLS that go to
  genGoogleMapsURL: (req, res, next) => {
    (res.locals.point1toMidptURL = `https://www.google.com/maps/dir/?api=1&origin=${
      res.locals.point1.lat
    },${res.locals.point1.lng}&destination=${res.locals.midpt.lat},${
      res.locals.midpt.lng
    }&travelmode=driving`),
      (res.locals.point2toMidptURL = `https://www.google.com/maps/dir/?api=1&origin=${
        res.locals.point2.lat
      },${res.locals.point2.lng}&destination=${res.locals.midpt.lat},${
        res.locals.midpt.lng
      }&travelmode=driving`);
    next();
  }
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
googleMapsController.genGoogleMapsURL(null, res, () => {
  console.log('next called');
  console.log(
    'point1 to midpoint directions url: ',
    res.locals.point1toMidptURL,
    'point2 to midpoint directions url: ',
    res.locals.point2toMidptURL
  );
});
module.exports = googleMapsController;
