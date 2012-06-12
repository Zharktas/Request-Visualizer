
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


exports.index = function(req, res){
	RequestModel.findOne().select('time').sort({'time': 'asc'}).exec(function(err, mindoc){
		var min = mindoc.time.getTime();
		console.log(mindoc);
		RequestModel.findOne().select('time').sort({"time": 'desc'}).exec(function(err, maxdoc){
			var max = maxdoc.time.getTime();
			console.log(maxdoc);
			res.render('index', { title: 'Request Visualizer', seekbarmin: min, seekbarmax: max })
		});
	 });
};

exports.requests = function(req, res){
	
	var o = {};
	var m = function(){
		if ( this.location.geo ){
			emit(this.location.ip, { ll: this.location.geo.ll, path: this.path });
		}
	}
	
	var r = function(key, values){
		var location = {
			ll: null,
			paths: []
		};
		
		values.forEach(function(loc){
			location.ll = loc.ll;
			location.paths.push(loc.path);
		});
		
		return location;
	}
	
	o.map = m;
	o.reduce = r;
	o.out = {replace: "pathsasdasd"};
	o.verbose = true;
	
	RequestModel.mapReduce(o, function(err, model, stats){
		console.log('map reduce took %d ms', stats.processtime)
		
		model.find({}, function(err, docs){
			res.json(docs);
		});
	});
	
};
