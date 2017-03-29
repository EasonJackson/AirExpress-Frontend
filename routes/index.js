var express = require('express');
var router = express.Router();
//var spawn = require('child_process').spawn;
//var rpc_client = spawn('java', ['-cp', 'java-json.jar:.', 'ExampleClient']);
var rpc_client = require('../rpc_client/rpc_client');
var operator = require('../Operator');

// Raw data list
var raw_results = [];
var raw_flight_depart = [];
var raw_flight_return = [];

// Parameterized data list
var flight_depart_display = [];
var flight_return_display = [];
var flights_depart_by_price = [];
var flights_depart_by_duration = [];
var flights_return_by_price = [];
var flights_return_by_duration = [];

var selectTrip = {};
var RoundTrip;


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
router.get('/rawresult', function(req, res, next) {
	var dep = req.query.dep_airport;
	var ari = req.query.ari_airport;
	var dep_time = req.query.dep_time;
	var ret_time = req.query.ret_time;

	console.log("Params " + dep + "+" + ari + "+" + dep_time + "+" + ret_time);

	rpc_client.searchFlight(dep, ari, dep_time, ret_time, function(response) {
		console.log("Web server receives response: " + response);
		if(response == undefined || response == null) {
			console.log("No result found.");
		} else {
			raw_results = JSON.parse(response);
		}
	});

	
	if(raw_results == null) {
		console.log("Parsing fails.");
	} else {
		console.log("Parsing successes.")
	}
	
	var tp = raw_results.result;
	
	raw_flight_depart = tp.depart;
	raw_flight_return = tp.return;

	for(i = 0; i <= raw_flight_depart.length - 1; i++) {
		//console.log(i);
		//console.log(flight_depart[i]);
		var te = raw_flight_depart[i].value;
		var info = {};
		info["depart"] = dep;
		info["arrival"] = ari;
		info["price_coach"] = 0;
		info["price_firstclass"] = 0;
		info["flightTime"] = 0;
		for (j = 0, len = te.length; j <= len - 1; j++) {
			if(te[j].id == 0) {
				info["departTime"] = te[j].TimeDepart;
			}
			info["arrivalTime"] = te[j].TimeArrival;
			var p_coach = te[j].PriceCoach;
			var p_firstclass = te[j].PriceFirstclass;
			info["price_coach"] += p_coach;
			info["price_firstclass"] += p_firstclass;
			info["flightTime"] += te[j].FlightTime;
		}
		info["price_coach"] = parseFloat(info["price_coach"]).toFixed(2);
		info["price_firstclass"] = parseFloat(info["price_firstclass"]).toFixed(2);
		//console.log({tripid: raw_flight_depart[i].tripid, info: info});
		flight_depart_display.push({tripid: raw_flight_depart[i].tripid, info: info});
	}

	if(raw_flight_return.length == 0) {
		RoundTrip = null;
	}else {
		RoundTrip = "True";
		for(i = 0; i <= raw_flight_return.length - 1; i++) {
			var te = raw_flight_return[i].value;
			var info = {};
			info["depart"] = ari;
			info["arrival"] = dep;
			info["price_coach"] = 0;
			info["price_firstclass"] = 0;
			info["flightTime"] = 0;
			for(j = 0, len = te.length; j <= len - 1; j ++) {
				if(te[j].id == 0) {
					info["departTime"] = te[j].TimeDepart;
				}
				info["arrivalTime"] = te[j].TimeArrival;
				info["price_coach"] += te[j].PriceCoach;
				info["price_firstclass"] += te[j].PriceFirstclass;
				info["flightTime"] += te[j].FlightTime;
			}
			info["price_coach"] = parseFloat(info["price_coach"].toFixed(2));
			info["price_firstclass"] = parseFloat(info["price_firstclass"]).toFixed(2);
			flight_return_display.push({tripid: raw_flight_return[i].tripid, info: info});
		}
	}

	sortByPrice(flight_depart_display, function(response) {
		console.log("sortByPrice function gets called. Working ...");
		if(response == undefined || response == null) {
			console.log("Sort failure.");
		} else {
			flights_depart_by_price = flight_depart_display.concat().sort(function(a, b) {
				return a.info.price_coach - b.info.price_coach;	
			});
		}
	});

	sortByPrice(flight_return_display, function(response) {
		console.log("sortByPrice function gets called. Working ...");
		if(response == undefined || response == null) {
			console.log("Sort failure.");
		} else {
			flights_return_by_price = flight_return_display.concat().sort(function(a, b) {
				return a.info.price_coach - b.info.price_coach;	
			});
		}
	});

	sortByDuration(flight_depart_display, function(response) {
		console.log("sortByDuration function gets called. Working ...");
		if(response == undefined || response == null) {
			console.log("Sort failure.");
		} else {
			flights_depart_by_duration = flight_depart_display.concat().sort(function(a, b) {
				return a.info.flightTime - b.info.flightTime;	
			});
		}
	}); 

	sortByDuration(flight_return_display, function(response) {
		console.log("sortByDuration function gets called. Working ...");
		if(response == undefined || response == null) {
			console.log("Sort failure.");
		} else {
			flights_return_by_duration = flight_return_display.concat().sort(function(a, b) {
				return a.info.flightTime - b.info.flightTime;	
			});
		}
	}); 

	//TODO parse results into array of items

	res.render('rawresult', { 
		title: TITLE,
		RoundTrip: RoundTrip,
	 	resultList_depart: flight_depart_display,
	 	resultList_return: flight_return_display
	 	});
});

router.get('/result', function(req, res, next) {
	var type = req.query.type;
	var tripid = parseInt(req.query.tripid);
	console.log(type);
	console.log(tripid);
	if(tripid == undefined || tripid == null) {
		res.render('result', {
			title: TITLE,
			selectTrip: selectTrip,
			RoundTrip: RoundTrip,
		 	resultList_depart: flight_depart_display,
		 	resultList_return: flight_return_display
		});
	}

	selectTrip.depart = null;
	selectTrip.return = null;

	if(type == "depart") {
		selectTrip.depart = flight_depart_display[tripid];
		//console.log("selectTrip:" + selectTrip);
		
	} else if(type == "return") {
		selectTrip.return = flight_return_display[tripid];
		//console.log("selectTrip:" + selectTrip);	
	}

	res.render('result', {
			title: TITLE,
			selectTrip: selectTrip,
			RoundTrip: RoundTrip,
		 	resultList_depart: flight_depart_display,
		 	resultList_return: flight_return_display
	});
});

router.get('/rawsort', function(req, res, next) {
	var sort = req.query.sort;
	if(sort == "price") {
		res.render('rawresult', {
			title: TITLE,
			RoundTrip: RoundTrip,
			resultList_depart: flights_depart_by_price,
			resultList_return: flights_return_by_price
		});
	} else if(sort == "duration") {
		res.render('rawresult', {
			title: TITLE,
			RoundTrip: RoundTrip,
			resultList_depart: flights_depart_by_duration,
			resultList_return: flights_return_by_duration
		});
	}
});

router.get('/sort', function(req, res, next) {
	var sort = req.query.sort;
	if(sort == "price") {
		res.render('result', {
			title: TITLE,
			selectTrip: selectTrip,
			RoundTrip: RoundTrip,
			resultList_depart: flights_depart_by_price,
			resultList_return: flights_return_by_price
		});
	} else if(sort == "duration") {
		res.render('result', {
			title: TITLE,
			selectTrip: selectTrip,
			RoundTrip: RoundTrip,
			resultList_depart: flights_depart_by_duration,
			resultList_return: flights_return_by_duration
		});
	}
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
	var tripid = parseInt(req.query.id);
	var type = req.query.type;
	var trip = [];
	if(tripid == undefined || tripid == null) {
		res.render('detail', {
			title: TITLE,
			trip: trip,
			tripid: tripid,
			type: None
		});
	}
	if(type == "depart") {
		trip = raw_flight_depart[tripid].value;
		console.log(raw_flight_depart[tripid].value);
		res.render('detail', {
			title: TITLE,
			trip: trip,
			tripid: tripid,
			type: type
		});
	} else if(type == "return") {
		trip = raw_flight_return[tripid].value;
		console.log(raw_flight_return[tripid].value);
		res.render('detail', {
			title: TITLE,
			trip: trip,
			tripid: tripid,
			type: type
		});
	}
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
