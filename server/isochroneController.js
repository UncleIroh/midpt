const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

const isochroneController = {};

isochroneController.getCoords = (req, res, next) => {
	//retrieve location data from req.body and parse
	console.log(process.env.GAPI_KEY);
	let promArr = [];
	for(let i = 0; i < 2; i++){
		let parsedStr = req.body['points'][i]['address'].replace(' ', '+');
		//make a fetch request to API
		let promise = new Promise((resolve, reject) => {
			request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + parsedStr + '&key=' + GAPI_KEY, {json: true}, (err, response, body) => {
				if(err) console.log(err)
				res.locals[`point${i+1}`] = body['results'][0]['geometry']['location'];
				res.locals[`address${i+1}`] = body['results']
				resolve();
			});
		});
		promArr.push(promise);
	}
	Promise.all(promArr).then(() => next())
}

isochroneController.generateRoutes = (req, res, next) => {
	let time1;
	let time2;
	const promArr = [];
	promArr.push(new Promise((resolve, reject) => {
		request.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=
		${res.locals.point1.lat},${res.locals.point1.lng}
		&destinations=${res.locals.point2.lat},${res.locals.point2.lng}
		&key=` + GAPI_KEY,
		(err, res, body) => {
			if(err) console.log(err);
			time1 = JSON.parse(body)['rows'][0]['elements'][0]['duration']['value'];
		})
		resolve(time1);
}));
	promArr.push(new Promise((resolve, reject) => {request.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=
	${res.locals.point2.lat},${res.locals.point2.lng}
	&destinations=${res.locals.point1.lat},${res.locals.point1.lng}
	&key=` + GAPI_KEY,
	(err, res, body) => {
		if(err) console.log(err);
		
		time2 = JSON.parse(body)['rows'][0]['elements'][0]['duration']['value'];
		resolve(body);
	})
}));
	//do the promise thing
	Promise.all(promArr).then(() => {
		res.locals.fairTime = Math.ceil((1-(time1/(time1+time2)))*time1),
		next();
	});
}

module.exports = isochroneController;