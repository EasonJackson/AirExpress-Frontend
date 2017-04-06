var fs = require("fs");
var sync = require("synchronize");
console.log("Starting");
var Airports = [];
sync(fs, 'readFile');
sync.fiber(function() {
	try {
		// Use valid airports data
		var data = sync.await(fs.readFile("../Utils/Airports.json"));
		Airports = JSON.parse(data);
    	//console.log("Contents of file: " + data);
    	console.log("Airport loaded.");
    	console.log(Airports.length);

    	return Airports;
	} catch (err) {
		// No valid data, retreaving from server and make a new json file
		
	}
});

console.log("Carrying on executing");