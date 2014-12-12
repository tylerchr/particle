var assert = require('assert'),
	objectHash = require('object-hash'),
	Promise = require('bluebird'),
	porqpine = require('porqpine'),
	loader = require(__paths.server.loaders),
	notifications = require(__paths.server.services + '/client-notifications');

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
			})
			.then(function(data){
				notifications.addNotification(user);
				return data;
			});
	},
	getDataPoints: function(user, startDate, endDate)
	{
		console.log(startDate, endDate);

		return porqpine.getDb('particle')
			.then(function(db) {
				return db.collection('datapoints')
					.find({
						"owner": user,
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
	countDataPoints: function(user)
	{
		return porqpine.getDb('particle')
			.then(function(db) {
				return db.collection('datapoints')
					.groupAsync({
						"data.type": 1
					},
					{
						"owner": user
					},
					{
						count: 0,
						dates: {
							earliest: 0,
							latest: 0
						}

					},
					function(obj, prev) {
						prev.count++;
						if (!prev.dates.earliest || obj.data.date < prev.dates.earliest)
							prev.dates.earliest = obj.data.date;
						if (!prev.dates.latest || obj.data.date > prev.dates.latest)
							prev.dates.latest = obj.data.date;
					});
			})
			.then(function(data) {
				return data.map(function(dataPointType) {
					dataPointType.type = dataPointType['data.type'];
					delete dataPointType['data.type'];
					return dataPointType;
				});
			})
			.catch(function(err) {
				console.error('mongo baddie');
				console.error(err);
			});
	},
	getTimelineData: function(user, startDate, endDate)
	{
		var lastfm = require(__paths.server.loaders + '/lastfm');

		return module.exports.getDataPoints(user, startDate, endDate)
			.then(function(points) {
				return points.map(function(point) {
					return loader.getLoader(point.data.type).formatForTimeline(point.data);
				});
			});
	},
	getTimeSeriesData: function(user)
	{
		return porqpine.getDb('particle')
			.then(function(db) {
				return db.collection('datapoints')
					.aggregateAsync([
						{
							$project: {
								day: {
									years: {
										$year: '$data.date'
									},
									months: {
										$month: '$data.date'
									},
									days: {
										$dayOfMonth: '$data.date'
									}
								},
							}
						},
						{
							$group: {
								_id: {
									day: '$day'
								},
								count: {
									$sum: 1
								}
							}
						},
						{
							$sort: {
								_id: 1
							}
						}
					]);
			})
			.then(function(data) {
				return data.map(function(day) {
					return {
						date: [
							day._id.day.years,
							day._id.day.months,
							day._id.day.days
						].join('-'),
						value: day.count
					}
				});
			});
	}
};
