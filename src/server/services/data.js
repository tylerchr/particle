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
	}
};
