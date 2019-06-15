const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: false }));
const isochroneController = require('./isochroneController');

console.log(process.env);
// setup!
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/build', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}

app.listen(3000); //listens on port 3000 -> http://localhost:3000/
console.log('this works, at least');
// routes here
app.post(
  '/buildroute',
  isochroneController.getCoords,
  isochroneController.generateRoutes,
  (req, res) => {
    res.json({ fairTime: res.locals.fairTime });
  }
);

app.get('/api/', (req, res) => {
  //do stuff
});
