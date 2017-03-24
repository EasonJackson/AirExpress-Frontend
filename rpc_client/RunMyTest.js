var java  = require("java");
java.classpath.push("./src");

var test = java.import("test");

console.log(test.PrintSync());

//console.log(instance.PrintSync());