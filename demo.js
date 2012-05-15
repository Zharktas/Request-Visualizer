var express = require('express');
var app = express.createServer();

var visualizer = require('./Request-Visualizer.js');

app.use(visualizer.log);

app.get('/', function(req, res){
	res.send("Request logged.");
});

app.listen(9000);

