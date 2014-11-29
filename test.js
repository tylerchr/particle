// get started
require('./bootstrap')();

var lastfm = require(__paths.server + '/loaders/lastfm.js');

lastfm.load('tylerchr')
	.then(function() {
		console.log('done');
	});
