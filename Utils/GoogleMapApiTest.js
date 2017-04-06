var googleMapsClient = require('@google/maps').createClient({
	  key: 'AIzaSyAmGNL2f_7a172eqp4YPnmTU-eqQFzWcNk'
	});

googleMapsClient.timezone({
	location: '42.3601' + "," + '-71.0589'
	}, function(err, response) {
	if (!err) {
		resp = response.json.results;
		console.log(response);
	}
	else {
		console.err(err);
	}
});