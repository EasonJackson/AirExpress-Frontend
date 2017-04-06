var Geoclient = require('./GetGeo');
var sync = require('synchronize');
var fs = require('fs');
var Airports =[];
var Airports_local = [];
var offset = [];


fs.readFile("test.txt", "utf8", function(error, data, next) {
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
    	Airports = JSON.parse(data);
    	//console.log("Contents of file: " + data);
    	//console.log(Airports);
    	console.log("Airport loaded.");
        d();  
	}
});
   
function d() {
    for(i = 0; i <= Airports.length - 1; i++) {
        console.log(Airports[i].Latitude + "," + Airports[i].Longitude);
        // var date = Geoclient.getTimezone(Airports[i].Latitude, Airports[i].Longitude, function(response) {
        //    offset.push(response.json);
        //    console.log(offset);
        // });
        // var date = Geoclient.getTimezone(Airports[i].Latitude, Airports[i].Longitude);
        // console.log(date);
        // var data = sync.await(Geoclient.getTimezone(Airports[i].Latitude, Airports[i].Longitude, sync.defer()));
        // offset.push(date);
        // console.log(offset);
        sync(Geoclient, 'getTimezone');
        sync.fiber(function () {
            try{
                var data = sync.await(Geoclient.getTimezone(Airports[i].Latitude, Airports[i].Longitude, sync.defer()));
                console.log(data);
                offset.push(data);
            } catch (err) {
                console.log(err);
            }
        })
        console.log(offset.length);
    }
}



function a(){

}

    function b(req, res, next) {
        var query = {};
        query.Name = Airports[i].Name;
        query.Code = Airports[i].Code;
        query.Latitude = Airports[i].Latitude;
        query.Longitude = Airports[i].Longitude;
        query.Offset = 1000 * offset.rawOffset + 1000 * offset.dstOffset;
        Airports_local.push(query);
        next();
    }
    
    function c(req, res) {
        fs.writeFile("Test_Offset.json", Airports_local, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    }

 




