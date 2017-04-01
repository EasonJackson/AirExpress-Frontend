var googleMapsClient = require('@google/maps').createClient({
	  key: 'AIzaSyAmGNL2f_7a172eqp4YPnmTU-eqQFzWcNk'
	});

console.log("client creating ");
function getTimezone(lat, lng) {
	//console.log(lat + "+" + lng);
	var resp = null;
	googleMapsClient.timezone({
		location: lat + "," + lng
		}, function(err, response) {
		if (!err) {
			resp = response.json.results;
		}
	});
	return 1000*resp.rawOffset + 1000*resp.dstOffset;
}

module.exports = {
	getTimezone: getTimezone,
};