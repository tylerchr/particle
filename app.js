// get started
require('./bootstrap')();

var express = require('express'),
	git = require('git-rev'),
	_ = require('underscore'),
	socketio = require('socket.io'),
	path = require('path'),
	http = require('http');

git.short(function(rev) {
	console.log('Current revision: ' + rev);
});

var app = express();
app.configure(function() {
	app.use(express.logger('dev'));
	app.use(express.urlencoded());
	app.use(express.json());
	app.use(express.static(__paths.client));
});

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
