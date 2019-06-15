const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
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

// routes here

app.get('/api/', (req, res) => {
  //do stuff
});

// const promArr = [];

// promArr.push(
//   new Promise((resolve, reject) => {
//     request.get(url1, (err, data) => {
//       // do stuff with data or something
//       resolve(data);
//     });
//   })
// );

// promArr.push(
//   new Promise((resolve, reject) => {
//     request.get(url2, (err, data) => {
//       // do stuff with data or something
//       resolve(data);
//     });
//   })
// );

// Promise.all(promArr).then(valuesArr => {});
