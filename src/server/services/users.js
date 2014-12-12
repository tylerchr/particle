var assert = require('assert'),
	objectHash = require('object-hash'),
	Promise = require('bluebird'),
	porqpine = require('porqpine'),
	crypto = require('crypto');

var tokens = {};

module.exports = {

	createToken: function(user) {
		var token = crypto.randomBytes(24).toString('hex');
		tokens[token] = user;
		return token;
	},

	getUserFromToken: function(token) {
		return tokens[token];
	},

	getUser: function(email) {
		return porqpine.getDb('particle')
			.then(function(db) {
				return db.collection('users').find({ email: email }).toArrayAsync();
			})
			.then(function(data) {
				return data;
			});
	},

	addUser: function(user) {
		return porqpine.getDb('particle')
		.then(function(db) {
			return db.collection('users').insertAsync(user);
		})
		.then(function(data) {
			console.log(data);
			return data;
		});
	}
}