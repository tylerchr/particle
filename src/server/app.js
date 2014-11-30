// get started
require('./bootstrap')();

var express = require('express'),
	bodyParser = require('body-parser'),
	git = require('git-rev'),
	_ = require('underscore'),
	socketio = require('socket.io'),
	path = require('path'),
	http = require('http');

git.short(function(rev) {
	console.log('Current revision: ' + rev);
});

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log(__paths.client);
app.use(express.static(__paths.client));

// set up some routes
var dataRoutes = require(__paths.server.routes + '/data-routes');
app.use('/api/v1', dataRoutes);

var port = 8080,
	server = http.Server(app);

server.listen(port, function() {
	console.log('Server started on port ' + port);
});

var io = socketio(server);

var iteration = 0;
io.sockets.on('connection', function(socket) {

	console.log('Somebody connected');

	// setInterval(function() {

	// 	socket.emit('data-count', {
	// 		count: iteration
	// 	});
	// 	socket.broadcast.emit('data-count', {
	// 		count: iteration
	// 	});

	// 	iteration++;

	// }, 500);
});