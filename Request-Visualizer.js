var geoip = require('geoip-lite');

module.exports = function(req, res, next ){
	
	var ip = req.header('x-forwarded-for');
	console.log(ip);
	var geo = geoip.lookup(ip);
	console.log(geo);
	next();
}
