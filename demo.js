var express = require('express');
var app = express.createServer();

var visualizer = require('./lib/Request-Visualizer.js');

app.use(visualizer.log);

app.get('/demo.json', function(req, res){
	visualizer.all(req, res);
});

function results(docs){
	console.log(docs);
}

app.listen(9000);

