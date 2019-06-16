const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: false }));
const isochroneController = require('./isochroneController');
const googleMapsController = require('./googleMapsController');
const centroidController = require('./centroidController');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/build', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}

console.log(process.env.NODE_ENV);

app.listen(3000); //listens on port 3000 -> http://localhost:3000/
console.log('this works, at least !');
// routes here
app.post(
  '/buildroute',
  isochroneController.getCoords,
  isochroneController.generateRoutes,
  isochroneController.generateIsochrones,
  centroidController.getCentroid,
  googleMapsController.genGoogleMapsURL,
  (req, res) => {
    // console.log(res.locals);
    // res.json({ fairTime: res.locals.fairTime });
    res.status(200).json(res.locals);
  }
);

app.get('/api/', (req, res) => {
  //do stuff
});
