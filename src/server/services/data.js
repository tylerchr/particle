var assert = require('assert'),
	objectHash = require('object-hash'),
	Promise = require('bluebird'),
	porqpine = require('porqpine');

module.exports = {
	saveDataPoint: function(user, type, payload, opt_date)
	{
		assert.notEqual(user, false, 'User must exist');
		assert.notEqual(type, false, 'Type must exist');

		opt_date = opt_date || new Date();

		var pkg = {
			user: user,
			type: type,
			date: opt_date,
			payload: payload
		};

		var hash = objectHash(pkg),
			dbDocument = {
				owner: user,
				hash: hash,
				importDate: new Date(),
				data: {
					type: type,
					date: opt_date,
					payload: payload
				}
			};

		return porqpine.getDb('particle')
			.then(function(db) {
				return db.collection('datapoints').insertAsync(dbDocument);
			});
	},
	getDataPoints: function(startDate, endDate)
	{
		console.log(startDate, endDate);

		return porqpine.getDb('particle')
			.then(function(db) {
				return db.collection('datapoints')
					.find({
						"data.date": {
							$gte: startDate,
							$lt: endDate
						}
					})
					.sort({ "data.date": -1})
					.toArrayAsync();
			})
			.then(function(data) {
				return data;
			});
	},
	getTimelineData: function(startDate, endDate)
	{
		var lastfm = require(__paths.server.loaders + '/lastfm');

		return module.exports.getDataPoints(startDate, endDate)
			.then(function(points) {
				return points.map(function(point) {
					if (point.data.type === 'lastfm')
					{
						loader = lastfm;
					}
					return loader.formatForTimeline(point.data);
				});
			});
	}
};
