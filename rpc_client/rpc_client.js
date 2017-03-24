var java = require("java");
java.classpath.push("./rpc_client/src");

//var client = java.import("ExampleClient");
var client = java.import("test");

function searchFlight(depAIR, arrAIR, depTime, retTime, callback) {
	var resp = client.processRequestSync("searchFlight", [depAIR, arrAIR, depTime, retTime]);
	console.log(resp);
	callback(resp);
	console.log("Finished call rpc.")
}


function reserveFlight(flight, seatType, seatNumbers, callback) {
	var resp = client.processRequestSync("reserverFlight", [flight, seatType, seatNumbers]);
	console.log(resp);
	callback(resp);
}

module.exports = {
	searchFlight: searchFlight,
	reserveFlight: reserveFlight,
};