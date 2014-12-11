var socketio = require('socket.io');
var io = null;

module.exports = {
	init: function(httpServer)
	{
		io = socketio(httpServer);

		io.sockets.on('connection', function(socket) {

			// console.log('[%s] Somebody connected', socket.id);

			// first, find out who we are talking to
			socket.emit('user-challenge');
			socket.on('user-challenge-response', function(user) {
				// subscribe the socket to the user room
				// console.log('[%s] It\'s %s!', socket.id, user.email);
				socket.join('/users/' + user.email);
			});
		});

	},
	emitToUser: function(user, evt, message)
	{
		// broadcast to the user's room!
		io.to('/users/' + user).emit(evt, message);
	}
};