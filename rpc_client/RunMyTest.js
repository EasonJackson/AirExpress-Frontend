var java  = require("java");
//java.classpath.push("./src");
//java.classpath.push('test.jar');
//java.classpath.push('mytest.test');
//java.classpath.push('secondtest.implement');

//var test = java.newInstanceSync("secondtest.implement");

//console.log(test.outputSync());

//console.log(instance.PrintSync());

java.classpath.push("FlightSys.jar");

var client = java.newInstanceSync("ExampleClient");

var resp = client.getAirportsSync("getAirports");

console.log(resp);