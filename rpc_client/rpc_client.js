var java = require("java");
//java.classpath.push("./rpc_client/test.jar");
java.classpath.push('./rpc_client/FlightSys.jar');

var client = java.newInstanceSync("ExampleClient");

function searchFlight(depAIR, arrAIR, depTime, retTime, callback) {
	var resp = client.searchFlightSync("searchFlight", [depAIR, arrAIR, depTime, retTime]);
	//console.log(resp);
	callback(resp);
	console.log("Finished call rpc.");
}


function reserveTrip(flight, seatType, callback) {
	console.log("reserveTrip gets called");
	var resp = client.reserveTripSync("reserveTrip", [seatType, flight]);
	console.log(resp);
	callback(resp);
	console.log("Finished call rpc.");
}

function getAirports(callback) {
	var resp = client.getAirportsSync("getAirports");
	console.log(resp);
	console.log("Finished call rpc.");
}

module.exports = {
	searchFlight: searchFlight,
	reserveTrip: reserveTrip,
	getAirports: getAirports
};