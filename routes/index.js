var express = require('express');
var router = express.Router();
//var spawn = require('child_process').spawn;
//var rpc_client = spawn('java', ['-cp', 'java-json.jar:.', 'ExampleClient']);
var rpc_client = require('../rpc_client/rpc_client');
var operator = require('../Operator');
var results = [];
var results_by_price = [];
var results_by_duration = [];

TITLE = 'Welcome to WPI';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: TITLE, 
  						RoundTrip: 'True'});
});

router.get('/roundTrip', function(req, res, next) {
	res.render('index', { title: TITLE, 
						  RoundTrip: 'True'});
});

router.get('/oneWay', function(req, res, next) {
	res.render('index', { title: TITLE });
});


// Result page test method
router.get('/result', function(req, res, next) {
	var dep = req.query.dep_airport;
	var ari = req.query.ari_airport;
	var dep_time = req.query.dep_time;
	var ret_time = req.query.ret_time;
	var temp;

	console.log("Params " + dep + "+" + ari + "+" + dep_time + "+" + ret_time);

	rpc_client.searchFlight(dep, ari, dep_time, ret_time, function(response) {
		console.log("Web server receives response: " + response);
		if(response == undefined || response == null) {
			console.log("No result found.");
		} else {
			temp = response;
		}
	});

	results = JSON.parse(temp);
	if(results == null) {
		console.log("Parsing fails.");
	} else {
		console.log("Parsing successes.")
	}
	// Test for the output
	console.log(results);

	sortByPrice(results, function(response) {
		console.log("sortByPrice function gets called. Working ...");
		if(response == undefined || response == null) {
			console.log("Sort failure.");
		} else {
			results_by_price = response;
		}
	});

	sortByDuration(results, function(response) {
		console.log("sortByDuration function gets called. Working ...");
		if(response == undefined || response == null) {
			console.log("Sort failure.");
		} else {
			results_by_duration = response;
		}
	});

	//TODO parse results into array of items


	res.render('result', { 
		title: TITLE,
	 	resultList: results });
});

router.post('/result', function(req, res, next) {
	var method = req.query.id;
	sortList = [];

	console.log("Receive request for sorting");

	if(method == "price") {
		sortList = results_by_price;
	} else if(method == "duration") {
		sortList = results_by_duration;
	} else {
		res.render('result', {
			title: TITLE,
			message: "Internal function call error."
		});
	}
	/* GET search result */
	res.render('result', {
		title: TITLE, 
		resultList: sortList});
	
});


/* GET detail page for flight info */
router.get('/detail', function(req, res, next) {
	console.log("Received request for listing details of a flight.");
	flights = req.query.tripNumber;
	getFlightDetails(tripNumber, function(response) {
		result = [];
		if(response == undefined || response == null) {
			console.log("Flight retreaving error.");
		} else {
			results = response;
		}
	});
	res.render('detail', {
		title: TITLE,
		result: results,
	});
});

router.post('/confirm', function(req, res, next) {
	var flight = req.query.tripNumber;
	var seatType = req.query.seatType;
	var seatNumbers = req.query.seatNumbers;

	console.log("Params " + flight + "+" + seatType + "+" + seatNumbers);
	rpc_client.reserverFlight(flight, seatType, seatNumbers, function(response) {
		console.log("Web server receives response: " + response);
		results = [];
		if(response == undefined || response == null) {
			console.log("Reservation failure.");
			res.render('detail', 
				{title: TITLE,
				 message: "The reservation is not available. <a href = '/'> Back to home </a>"
			});
		} else {
			result = response;
			console.log("Reservation successes.");
			res.render('confirm', {title: TITLE});
		}
	});
});

function sortByPrice(resultsOrig, callback) {
	results = [];
	var resp = operator.sortByPrice(resultsOrig);
	if(resp == undefined || resp == null) {
		console.log("Web server operator error.");
	} else {
		results = resp;
	}
	callback(results);
}

function sortByDuration(resultsOrig, callback) {
	results = [];
	var resp = operator.sortByDuration(resultsOrig);
	if(resp == undefined || resp == null) {
		console.log("Web server operator error.");
	} else {
		results = resp;
	}
	callback(results);
}

function getFlightDetails(tripNumberKey, callback) {
	result = [];
	for(var id = 0; id < results.length; id++) {
		if(results[id].tripNumber = tripNumberKey) {
			result = results[id];
		}
	}
	callback(result);
}

module.exports = router;
