var dataApi = require(__paths.server + '/services/data.js'),
	request = require('request'),
	Promise = require('bluebird'),
	userSettings = require(__paths.server + '/services/user-settings');

function retrievePage(user, apiKey, opt_page, opt_limit)
{
	opt_page = parseInt(opt_page || 1);
	opt_limit = parseInt(opt_limit || 200);
	var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + user + '&api_key=' + apiKey + '&format=json&page=' + opt_page + '&limit=' + opt_limit;

	return new Promise(function(resolve, reject) {
		request(url, function(err, response, body) {
			var data = JSON.parse(body);
			resolve(data.recenttracks.track);
		});
	});
}

module.exports = {
	load: function(user)
	{
		return userSettings.getSettings('tylerchr', 'lastfm')
			.then(function(settings) {
				return retrievePage(settings.username, settings.apiKey, 1, 10)
			})
			.then(function(tracks) {
				return Promise.all(tracks.map(function(track) {
					var date = new Date(parseInt(track.date.uts) * 1000),
						payload = {
							track: track.name,
							artist: track.artist['#text'],
							album: track.album['#text']
						};

					return dataApi.saveDataPoint(user, 'lastfm', payload, date)
						.catch(function(err) {
							if (err.cause && err.cause.code == 11000)
							{
								// console.log('Data point already exists');
								return Promise.resolve();
							}
							console.error(err);
							throw err;
						});
				}));
			})
			.catch(function(err) {
				console.error('Could not retrieve page', err);
			});
	}
};
