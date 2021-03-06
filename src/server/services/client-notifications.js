var socketManager = require(__paths.server.services + "/socket-manager");
var timeouts = {};

module.exports = {

	addNotification: function(user)
	{
		clearTimeout(timeouts[user]);
		timeouts[user] = setTimeout(function(){
			module.exports.pushNotification(user)
		}, 100);
	},

	pushNotification: function(user)
	{
		socketManager.emitToUser(user, "newData", "You've got new data!");
	}

};