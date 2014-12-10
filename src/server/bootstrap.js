//
// this file sets up a handful of important things
//

var path = require('path'),
	porqpine = require('porqpine');

module.exports = function()
{
	// set up some global paths
	global.__paths = {
		common: path.normalize(path.join(__dirname, '../common')),
		client: path.normalize(path.join(__dirname, '../client')),
		server: {
			base: path.normalize(path.join(__dirname)),
			loaders: path.normalize(path.join(__dirname, './loaders')),
			routes: path.normalize(path.join(__dirname, './routes')),
			services: path.normalize(path.join(__dirname, './services'))
		}
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
			return db.collection('datapoints').ensureIndexAsync('hash', { unique: true })
				.then(function(){
					return db.collection('users').ensureIndexAsync('email', {unique: true});
				});
		});

};