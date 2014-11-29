var express = require('express'),
	git = require('git-rev'),
	_ = require('underscore'),
	socketio = require('socket.io'),
	path = require('path');

git.short(function(rev) {
	console.log('Current revision: ' + rev);
});

global.__paths = {
	client: path.normalize(path.join(__dirname, './src/client')),
	server: path.normalize(path.join(__dirname, './src/server'))
};

var app = express();
app.configure(function() {
	app.use(express.logger('dev'));
	app.use(express.urlencoded());
	app.use(express.json());
	app.use(express.static(__paths.client));
});

var port = 8080;
var server = app.listen(port, function() {
	console.log('Server started on port ' + port);
});

// start up socketio
var io = socketio.listen(server);

var iteration = 0;
io.sockets.on('connection', function(socket) {
	console.log('Somebody connected');

	setInterval(function() {

		socket.emit('data-count', {
			count: iteration
		});
		socket.broadcast.emit('data-count', {
			count: iteration
		});

		iteration++;

	}, 500);
});
