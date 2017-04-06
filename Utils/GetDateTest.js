var GMT = "2017 May 13 10:40 GMT";
var off = 14400000;
var s = getLocalTime(off, GMT);
console.log(s);

function getLocalTime(off, GMT) {
	var local = new Date(Date.parse(GMT) + off);
	var result = local.getUTCDate() + "/" + (local.getUTCMonth() + 1).valueOf() + " " + local.getUTCHours() + ":" + local.getUTCMinutes();
	return result;
}
