var fs = require("fs");
console.log("Starting");
fs.readFile("test.txt", "utf8", function(error, data) {
    if(error) throw error;
    console.log("Contents of file: " + data);
});
console.log("Carrying on executing");