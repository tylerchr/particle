var dataApi = require(__paths.server.services + '/data.js'),
	request = require('request'),
	Promise = require('bluebird'),
	userSettings = require(__paths.server.services + '/user-settings');

function retrievePage(user, apiKey, opt_page, opt_limit)
{
	opt_page = Math.max(1, parseInt(opt_page || 1));
	opt_limit = Math.min(parseInt(opt_limit || 200), 200);
	var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + user + '&api_key=' + apiKey + '&format=json&page=' + opt_page + '&limit=' + opt_limit;

	return new Promise(function(resolve, reject) {
		request(url, function(err, response, body) {
			if (err)
			{
				reject(err);
			}
			else
			{
				var data = JSON.parse(body);
				if (data.recenttracks && data.recenttracks.track)
				{
					resolve(data.recenttracks.track);
				}
				else
				{
					console.error('No recent tracks found!', data);
					reject("No recent tracks found!");
				}
			}
		});
	});
}

module.exports = {
	load: function(user)
	{
		return userSettings.getSettings(user, 'lastfm')
			.then(function(settings) {
				return retrievePage(settings.username, settings.apiKey, 1, 200)
			})
			.then(function(tracks) {
				return Promise.all(tracks.map(function(track) {

					// no date, maybe it's still streaming
					if (!track.date)
					{
						return Promise.resolve();
					}

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
	},
	formatForTimeline: function(dataPoint)
	{
		return {
			timestamp: dataPoint.date,
			title: "Listened to \"" + dataPoint.payload.track + "\"",
			message: dataPoint.payload.artist + ", \"" + dataPoint.payload.album + "\""
		};
	}
};
