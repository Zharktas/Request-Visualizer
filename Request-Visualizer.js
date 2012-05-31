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
	
	process.nextTick(function(){
		var ip = req.headers['x-forwarded-for'];
		var geo = geoip.lookup(ip);
		var request = new RequestModel();
		request.path = url.parse(req.url);
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
