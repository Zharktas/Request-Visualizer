var geoip = require('geoip-lite');
var url = require('url');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Request-Visualizer');

var Schema = mongoose.Schema;
var Request = new Schema({
	path		: {},
	location	: {
		ip: String,
		geo: {}
	},
	time		: Date
});

var RequestModel = mongoose.model('Request', Request);


module.exports.log = function(req, res, next ){
	
	var ip = req.headers['x-forwarded-for'];
	if ( !ip ){
		ip = req.connection.remoteAddress;
	}

	var path = url.parse(req.url);
	
	process.nextTick(function(){
		console.log(ip);
		var geo = geoip.lookup(ip);
		var request = new RequestModel();
		request.path = path;
		console.log(path);
		request.location.ip = ip;
		request.location.geo = geo;
		request.time = new Date();
		request.save(function(err){
			if ( err ){
				console.log(err);
			}
		});
	});
	next();
}

module.exports.all = function(req, res){
	RequestModel.find({}, function(err, docs){
		res.json(docs);
	});
}
