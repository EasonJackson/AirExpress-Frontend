var sync = require('synchronize');
var googleMapsClient = require('@google/maps').createClient({
	  key: 'AIzaSyAmGNL2f_7a172eqp4YPnmTU-eqQFzWcNk'
	});

console.log("client creating ");

function getTimezone(lat, lng, callback) {
	console.log(lat + "+" + lng);
	var resp;
	sync(googleMapsClient, 'timezone')
	sync.fiber(function() {
		resp = googleMapsClient.timezone({
		location: lat + "," + lng});
	callback(resp.json);
	})
	
}

module.exports = {
	getTimezone: getTimezone,
};