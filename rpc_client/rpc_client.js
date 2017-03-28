var java = require("java");
//java.classpath.push("./rpc_client/src");
java.classpath.push('./rpc_client/FlightSys.jar');

var client = java.newInstanceSync("ExampleClient");

function searchFlight(depAIR, arrAIR, depTime, retTime, callback) {
	var resp = client.searchFlightSync("searchFlight", [depAIR, arrAIR, depTime, retTime]);
	console.log(resp);
	callback(resp);
	console.log("Finished call rpc.");
}


function reserveFlight(flight, seatType, seatNumbers, callback) {
	var resp = client.reserverFlightSync("reserverFlight", [flight, seatType, seatNumbers]);
	console.log(resp);
	callback(resp);
	console.log("Finished call rpc.");
}

module.exports = {
	searchFlight: searchFlight,
	reserveFlight: reserveFlight,
};