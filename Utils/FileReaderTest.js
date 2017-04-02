var fs = require("fs");
console.log("Starting");
fs.readFile("Airports.json", function(error, data) {
    if(error) throw error;
    console.log("Contents of file: " + data);
    result = JSON.parse(data);
    console.log(result[0]);
});
console.log("Carrying on executing");