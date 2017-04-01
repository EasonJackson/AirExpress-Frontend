var Geoclient = require('./GetGeo');
var fs = require('fs');
var Airports;


fs.readFile("Airports.txt", "utf8", function(error, data, next) {
    if(error) {
    	/*
    	rpc_client.getAirports(function(response) {
    		console.log("rpc_client getAirports function gets called. Retreaving data ...");
    		if (response == undefined || response == null) {
    			console.log("Web server initializing failure.");
    			var err = new Error(500);
    			next(err);
    		}
    		var temp = JSON.parse(response);
    		var raw_airports = temp.result;
    		
    		for(airport in raw_airports) {
    			var Airport{};
    			Airport["Name"] = airport.Name;
    			Airport["Code"] = airport.Code;
    			Airport["Latitude"] = airport.Latitude;
    			Airport["Longitude"] = airport.Longitude;
    			Airport["Offset"] = geo.getTimezone(Airport.Latitude, Airport.Longitude);
    			// Offset will be in miliseconds
    			Airports.push(Airport);
    		}
    		// TODO write Airports to document
		});*/
		console.log(error);
    } else {
    	while(data === undefined) {
    		require('deasync').runLoopOnce();
    	}
    	Airports = JSON.parse(data);
    	//console.log("Contents of file: " + data);
    	console.log(Airports);
    	console.log("Airport loaded.");
	}
});
