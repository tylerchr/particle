var dataApi = require(__paths.server.services + '/data.js'),
	csv = require('csv'),
	Promise = require('bluebird'),
	userSettings = require(__paths.server.services + '/user-settings');

module.exports = {
	formatForTimeline: function(dataPoint)
	{
		return {
			timestamp: dataPoint.date,
			title: "You sent a click!",
			message: dataPoint.payload.sentence
		};
	}
};
