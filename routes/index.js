var express = require('express');
var router = express.Router();
var rpc_client = require('../rpc_client/rpc_client');
var operator = require('../Operator');
var fs = require('fs');

// Raw data list
var Airports = [];
var raw_airports = [];
var offset = [];
var raw_flight_depart = [];
var raw_flight_return = [];
var raw_flight_depart_c = [];
var raw_flight_return_c = [];

// Display list
var flight_depart_display = [];
var flight_return_display = [];

// Parameterized data list
var flights_depart_origin = [];
var fligths_return_oritin = [];
var flights_depart_by_price = [];
var flights_depart_by_duration = [];
var flights_return_by_price = [];
var flights_return_by_duration = [];

fs.readFile("./Utils/Airports.json", function (err, data) {
			//console.log(data);
			Airports = JSON.parse(data);
    		//console.log("Contents of file: " + data);
    		console.log("Airport loaded.");
    		//console.log(Airports);

    		for(i = 0; i <= Airports.length - 1; i++) {
				var key = Airports[i].Code;
				var value = Airports[i].Offset;
				//console.log(key + " " + value);
				offset[key] = value;
			}

		});

var selectTrip = {};
var RoundTrip;
var SortType;
var Leg = {};

TITLE = 'Welcome to WPI';

// Pre-load airports document



/* GET home page. */
router.get('/', function(req, res, next) {

		// No valid data, retreaving from server and make a new json file
		/*
		rpc_client.getAirports(function(response) {
    		console.log("rpc_client getAirports function gets called. Retreaving data ...");
    		if (response == undefined || response == null) {
    			console.log("Web server initializing failure.");
    		}
    		var temp = JSON.parse(response);
    		var raw_airports = temp.result;

    		//write Airports to document
			fs.writeFile("../Utils/Airports.json", Airports, function(err) {
			    if(err) {
			        return console.log(err);
			    }
			});
    	});
    	*/
	
	/*
	for(i = 0; i <= Airports.length - 1; i++) {
		var key = Airports[i].Code;
		var value = Airports[i].Offset;
		offset.push({key: value});
	}
	*/

	RoundTrip = "True";
  	res.render('index', { title: TITLE, 
  						RoundTrip: RoundTrip});
});

router.get('/roundTrip', function(req, res, next) {
	RoundTrip = "True";
	res.render('index', { title: TITLE, 
						  RoundTrip: RoundTrip});
});

router.get('/oneWay', function(req, res, next) {
	RoundTrip = null
	res.render('index', { title: TITLE,
						  RoundTrip: RoundTrip });
});


// Result page test method
router.get('/rawresult', function(req, res, next) {
	var dep = req.query.dep_airport;
	var ari = req.query.ari_airport;
	var dep_time = req.query.dep_time;
	var ret_time = req.query.ret_time;

	console.log("Params " + dep + "+" + ari + "+" + dep_time + "+" + ret_time);

	if(dep == undefined || ari == undefined 
		|| dep_time == undefined
		|| dep == null || ari == null || dep_time == null
		|| dep == "" || ari == "" || dep_time == "") {
		console.log("Invalid params");
		res.render('index', {
			title: TITLE,
			RoundTrip: RoundTrip,
			message: "Please use a valid input."
		});
	}

	rpc_client.searchFlight(dep, ari, dep_time, ret_time, function(response) {
		console.log("Web server receives response for searchFlight");
		if(response == undefined || response == null) {
			console.log("No result found.");
		} else {
			var raw_results = JSON.parse(response);

			if(raw_results == null) {
				console.log("Parsing fails.");
			} else {
				console.log("Parsing successes.")
			}
			var tp = raw_results.result;
	
			raw_flight_depart = tp.depart;
			raw_flight_return = tp.return;
		}
	});

	selectTrip.depart = null;
	selectTrip.return = null;

	raw_flight_depart_c = raw_flight_depart;
	raw_flight_return_c = raw_flight_return;

	flight_depart_origin = [];
	flight_return_origin = [];
	flights_depart_by_price = [];
	flights_depart_by_duration = [];
	flights_return_by_price = [];
	flights_return_by_duration = [];

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
		info["legs"] = 0;
		for (j = 0, len = te.length; j <= len - 1; j++) {
			te[j].TimeDepart = getLocalTime(te[j].CodeDepart, te[j].TimeDepart);
			if(te[j].id == 0) {
				info["departTime"] = te[j].TimeDepart;//te[j].TimeDepart;
				info["first_flightNumber"] = te[j].Number;
			}
			info["legs"] ++;
			info["arrivalTime"] = getLocalTime(te[j].CodeArrival, te[j].TimeArrival);//te[j].TimeArrival;
			te[j].TimeArrival = info["arrivalTime"];
			var p_coach = te[j].PriceCoach;
			var p_firstclass = te[j].PriceFirstclass;
			info["price_coach"] += p_coach;
			info["price_firstclass"] += p_firstclass;
			info["flightTime"] += te[j].FlightTime;
		}
		info["price_coach"] = parseFloat(info["price_coach"]).toFixed(2);
		info["price_firstclass"] = parseFloat(info["price_firstclass"]).toFixed(2);
		//console.log({tripid: raw_flight_depart[i].tripid, info: info});
		flight_depart_origin.push({tripid: raw_flight_depart[i].tripid, info: info});
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
			info["legs"] = 0;
			for(j = 0, len = te.length; j <= len - 1; j++) {
				te[j].TimeDepart = getLocalTime(te[j].CodeDepart, te[j].TimeDepart);
				if(te[j].id == 0) {
					info["departTime"] = te[j].TimeDepart;//te[j].TimeDepart;
					info["first_flightNumber"] = te[j].Number;
				}
				info["legs"] ++;
				info["arrivalTime"] = getLocalTime(te[j].CodeArrival, te[j].TimeArrival);//te[j].TimeArrival;
				te[j].TimeArrival = info["arrivalTime"];
				info["price_coach"] += te[j].PriceCoach;
				info["price_firstclass"] += te[j].PriceFirstclass;
				info["flightTime"] += te[j].FlightTime;
			}
			info["price_coach"] = parseFloat(info["price_coach"].toFixed(2));
			info["price_firstclass"] = parseFloat(info["price_firstclass"]).toFixed(2);
			flight_return_origin.push({tripid: raw_flight_return[i].tripid, info: info});
		}
	}

	sortByPrice(flight_depart_origin, function(response) {
		console.log("sortByPrice function gets called. Working ...");
		if(response == undefined || response == null) {
			console.log("Sort failure.");
		} else {
			flights_depart_by_price = flight_depart_origin.concat().sort(function(a, b) {
				return a.info.price_coach - b.info.price_coach;	
			});
		}
	});

	sortByPrice(flight_return_origin, function(response) {
		console.log("sortByPrice function gets called. Working ...");
		if(response == undefined || response == null) {
			console.log("Sort failure.");
		} else {
			flights_return_by_price = flight_return_origin.concat().sort(function(a, b) {
				return a.info.price_coach - b.info.price_coach;	
			});
		}
	});

	sortByDuration(flight_depart_origin, function(response) {
		console.log("sortByDuration function gets called. Working ...");
		if(response == undefined || response == null) {
			console.log("Sort failure.");
		} else {
			flights_depart_by_duration = flight_depart_origin.concat().sort(function(a, b) {
				return a.info.flightTime - b.info.flightTime;	
			});
		}
	}); 

	sortByDuration(flight_return_origin, function(response) {
		console.log("sortByDuration function gets called. Working ...");
		if(response == undefined || response == null) {
			console.log("Sort failure.");
		} else {
			flights_return_by_duration = flight_return_origin.concat().sort(function(a, b) {
				return a.info.flightTime - b.info.flightTime;	
			});
		}
	}); 

	//TODO parse results into array of items
	flight_depart_display = flight_depart_origin;
	flight_return_display = flight_return_origin;
	SortType = "origin";
	Leg.One = "True";
	Leg.Two = "True";
	Leg.Three = "True";

	res.render('result', { 
		title: TITLE,
		selectTrip: selectTrip,
		RoundTrip: RoundTrip,
		sort: SortType,
	 	resultList_depart: flight_depart_display,
	 	resultList_return: flight_return_display,
	 	oneLeg: Leg.One,
	 	twoLeg: Leg.Two,
	 	three_Leg: Leg.Three
	 	});
});

router.get('/result', function(req, res, next) {
	res.render('result', {
		title: TITLE,
		selectTrip: selectTrip,
		RoundTrip: RoundTrip,
		sort: SortType,
	 	resultList_depart: flight_depart_display,
	 	resultList_return: flight_return_display,
	 	oneLeg: Leg.One,
	 	twoLeg: Leg.Two,
	 	threeLeg: Leg.Three
	 });
});

router.get('/select', function(req, res, next) {
	var type = req.query.type;
	var tripid = parseInt(req.query.tripid);
	
	if(tripid == undefined || tripid == null
		|| type == undefined || type == null) {
		res.render('result', {
			title: TITLE,
			selectTrip: selectTrip,
			RoundTrip: RoundTrip,
			sort: SortType,
		 	resultList_depart: [],
		 	resultList_return: [],
		 	oneLeg: Leg.One,
		 	twoLeg: Leg.Two,
		 	threeLeg: Leg.Three
		});
	}

	if(type == "depart") {
		selectTrip.depart = flight_depart_origin[tripid];
		//console.log("selectTrip:" + selectTrip);
		
	} else if(type == "return") {
		selectTrip.return = flight_return_origin[tripid];
		//console.log("selectTrip:" + selectTrip);	
	}

	res.render('result', {
			title: TITLE,
			selectTrip: selectTrip,
			RoundTrip: RoundTrip,
			sort: SortType,
		 	resultList_depart: flight_depart_display,
		 	resultList_return: flight_return_display,
		 	oneLeg: Leg.One,
		 	twoLeg: Leg.Two,
		 	threeLeg: Leg.Three
	});
});


router.get('/unselect', function(req, res, next) {
	var type = req.query.type;

	if(type == "depart") {
		selectTrip.depart = null;
	} else if(type == "return") {
		selectTrip.return = null;
	}

	res.render('result', {
			title: TITLE,
			selectTrip: selectTrip,
			RoundTrip: RoundTrip,
			sort: SortType,
		 	resultList_depart: flight_depart_display,
		 	resultList_return: flight_return_display,
		 	oneLeg: Leg.One,
		 	twoLeg: Leg.Two,
		 	threeLeg: Leg.Three
	});
});

router.get('/sort', function(req, res, next) {
	SortType = req.query.sort;
	
	if(SortType == "price") {
		flight_depart_display = filterResultbyLegs(Leg, flights_depart_by_price);
		flight_return_display = filterResultbyLegs(Leg, flights_return_by_price);
	} else if(SortType == "duration") {
		flight_depart_display = filterResultbyLegs(Leg, flights_depart_by_duration);
		flight_return_display = filterResultbyLegs(Leg, flights_return_by_duration);
	} else if(SortType == "origin") {
		flight_depart_display = filterResultbyLegs(Leg, flight_depart_origin);
		flight_return_display = filterResultbyLegs(Leg, flight_return_origin);
	}

	res.render('result', {
			title: TITLE,
			selectTrip: selectTrip,
			RoundTrip: RoundTrip,
			sort: SortType,
		 	resultList_depart: flight_depart_display,
		 	resultList_return: flight_return_display,
		 	oneLeg: Leg.One,
		 	twoLeg: Leg.Two,
		 	threeLeg: Leg.Three
	});
});

router.get('/leg', function(req, res, next) {
	One_leg = req.query.one;
	Two_leg = req.query.two;
	Three_leg = req.query.three;
	Leg.One = One_leg;
	Leg.Two = Two_leg;
	Leg.Three = Three_leg;

	if(SortType == "price") {
		flight_depart_display = filterResultbyLegs(Leg, flights_depart_by_price);
		flight_return_display = filterResultbyLegs(Leg, flights_return_by_price);
	} else if(SortType == "duration") {
		flight_depart_display = filterResultbyLegs(Leg, flights_depart_by_duration);
		flight_return_display = filterResultbyLegs(Leg, flights_return_by_duration);
	} else if(SortType == "origin") {
		flight_depart_display = filterResultbyLegs(Leg, flight_depart_origin);
		flight_return_display = filterResultbyLegs(Leg, flight_return_origin);
	}

	res.render('result', {
			title: TITLE,
			selectTrip: selectTrip,
			RoundTrip: RoundTrip,
			sort: SortType,
		 	resultList_depart: flight_depart_display,
		 	resultList_return: flight_return_display,
		 	oneLeg: Leg.One,
		 	twoLeg: Leg.Two,
		 	threeLeg: Leg.Three
	});
})


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
			type: "None"
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

router.get('/reserve', function(req, res, next) {
	var typeOfSeat = req.query.typeOfSeat;

	if(typeOfSeat != "Coach" && typeOfSeat != "FirstClass") {
		console.log("Error typeOfSeat");
		res.render('confirm', {
			title: TITLE,
			message: "Wrong typeOfSeat"
		});
	}

	var trip_depart = raw_flight_depart_c[selectTrip.depart.tripid].value;
	var trip_return = raw_flight_return_c[selectTrip.return.tripid].value;
	input = [];
	for(i = 0; i <= trip_depart.length - 1; i++) {
		var query = "";
		query += trip_depart[i].Number + " " + trip_depart[i].CodeDepart + " " + trip_depart[i].TimeDepart;
		input.push(query);
	}

	for(i = 0; i <= trip_return.length - 1; i++) {
		var query = "";
		query += trip_return[i].Number + " " + trip_return[i].CodeDepart + " " + trip_return[i].TimeDepart;
		input.push(query);
	}
	var result = {};
	if(RoundTrip == "True" && selectTrip.length == 2) {
		rpc_client.reserveFlight(input, typeOfSeat, function(response) {
			console.log("Web server receives response for reserveFlight");
			if(response == undefined || response == null) {
				console.log("Reservation failure.");
			} else {
				var raw_results = JSON.parse(response);
				result = raw_results.result;	
			}
		});
	} else if(RoundTrip == null && selectTrip.length == 1) {
		rpc_client.reserveFlight(input, typeOfSeat, function(response) {
			console.log("Web server receives response for reserveFlight");
			if(response == undefined || response == null) {
				console.log("Reservation failure.");
			} else {
				var raw_results = JSON.parse(response);
				result = raw_results.result;
			}
		});
	}

	res.render('confirm', {
		title: TITLE,
		result: result
	});
});



function sortByPrice(flight_depart_display, callback) {
	response = [];
	callback(response);
}

function sortByDuration(flight_depart_display, callback) {
	response = [];
	callback(response);
}

function getLocalTime(code, GMT) {
	
	//console.log(offset.BOS);
	//console.log(offset[code]);
	var off = offset[code];
	var local = new Date(Date.parse(GMT) + off);
	var result = local.getUTCDate() + "/" + (local.getUTCMonth() + 1).valueOf() + " " + local.getUTCHours() + ":" + local.getUTCMinutes();
	//console.log(code + " / " + GMT + " / " + result);
	return result;
}

function filterResultbyLegs(leg, list) {
	var id = [];
	if(leg.One == "True") {
		id.push(1);
	}
	if(leg.Two == "True") {
		id.push(2);
	}
	if(leg.Three == "True") {
		id.push(3);
	}
	var result = [];
	for(i = 0; i <= list.length - 1; i++) {
		console.log(list[i].info.legs);
		if (id.includes(list[i].info.legs)) {
			result.push(list[i]);
		}
	}
	return result;
}


module.exports = router;
