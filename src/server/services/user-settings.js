var Promise = require('bluebird'),
	porqpine = require('porqpine');

module.exports = {
	getSettings: function(user, service)
	{
		return porqpine.getDb('particle')
			.then(function(db) {
				return db.collection('userSettings')
					.findOneAsync({
						owner: user,
						service: service
					})
					.then(function(data) {
						// return just the settings blurb
						return data.settings;
					});
			});
	},
	setSettings: function(user, service, settings)
	{
		return porqpine.getDb('particle')
			.then(function(db) {
				return db.collection('userSettings')
					.updateAsync({
						owner: user,
						service: service
					},
					{
						settings: settings
					},
					{
						upsert: true
					});
			})
			.then(function(results) {
				console.log('Saved %s settings for %s', service, user, results);
				return results;
			});
	}
};