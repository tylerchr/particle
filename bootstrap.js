//
// this file sets up a handful of important things
//

var path = require('path'),
	porqpine = require('porqpine');

module.exports = function()
{
	// set up some global paths
	global.__paths = {
		client: path.normalize(path.join(__dirname, './src/client')),
		server: path.normalize(path.join(__dirname, './src/server'))
	};

	// connect to our Mongo instance
	porqpine.setConfig({
		hosts: [
			{ host: 'localhost', port: 27017 }
		]
	});

	// ensure we have a unique index on datapoints.hash
	porqpine.getDb('particle')
		.then(function(db) {
			return db.collection('datapoints').ensureIndexAsync('hash', { unique: true });
		});

};