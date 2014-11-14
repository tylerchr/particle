var _ = require('underscore'),
	api = require('./lib/backing-store/api'),
	crypto = require('crypto');

api._setStore('text');

// log when we get new events
api.events.on('add', function(namespace) {

	api.countDataPoints(namespace)
		.then(function(count) {
			console.log('[' + namespace + '] now has ' + count + ' data points');
		});

});

var iteration = 0;
setInterval(function() {
	
	iteration++;

	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');

	api.addDataPoint('testing.document', null, {
		iteration: iteration,
		randomHash: hash
	});

}, 500);