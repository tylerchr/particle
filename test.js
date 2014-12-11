// get started
require('./src/server/bootstrap')();

// var lastfm = require(__paths.server.loaders + '/lastfm.js');

// lastfm.load('tylerchr')
// 	.then(function() {
// 		console.log('done');
// 	});

var loaders = require(__paths.server.loaders);
loaders.getLoader('lastfm').load('tyson.decker@gmail.com')
	.then(function() {
		console.log('Done!');
	});