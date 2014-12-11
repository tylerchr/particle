var dataApi = require(__paths.server.services + '/data.js'),
	csv = require('csv'),
	Promise = require('bluebird'),
	userSettings = require(__paths.server.services + '/user-settings');

module.exports = {
	load: function(user)
	{
		var filePath = __paths.server.base + '/../../data/tylerchr-timeclock.csv';

		return userSettings.getSettings(user, 'timeclock')
			.then(function(settings) {

				return new Promise(function(resolve, reject) {
					require('fs').createReadStream(filePath)
						.pipe(csv.parse({delimiter: ','}, function(err, data) {
							if (err)
							{
								reject(err);
							}
							else
							{
								// take out the headers
								resolve(data.slice(1));
							}
						}));
				})
				.then(function(data) {
					return Promise.all(data
						.filter(function(line) {
							if (line[1].toUpperCase() != settings.employeeId)
							{
								return false;
							}
							if (line[4] != 'Active')
							{
								return false;
							}
							return true;
						})
						.map(function(line, idx, arr) {
							var date = new Date(line[3]),
								payload = {
									clocked: (line[2] == 'CI' ? 'in' : 'out'),
									workplace: settings.workplace
								};

							if (payload.clocked == 'out' && idx > 0)
							{
								var previous = arr[idx - 1];
								if (previous && previous[2] == 'CI')
								{
									var clockedInDate = new Date(previous[3]);
									console.log(idx, previous, clockedInDate, date - clockedInDate);
									payload.duration = (date - clockedInDate) / 1000;
								}
							}

							return dataApi.saveDataPoint(user, 'timeclock', payload, date)
								.catch(function(err) {
									console.log("Got error saving!", err);
									if (err.cause && err.cause.code == 11000)
									{
										// console.log('Data point already exists');
										return Promise.resolve();
									}
									console.error(err);
									throw err;
								})
						}));
				});

			});
	},
	formatForTimeline: function(dataPoint)
	{
		var returnObj = {
			timestamp: dataPoint.date,
			title: 'Clocked ' + dataPoint.payload.clocked.toUpperCase() + ' at ' + dataPoint.payload.workplace,
		};

		if (dataPoint.payload.clocked == 'out')
		{
			var value = dataPoint.payload.duration;
			var units = ['seconds', 'minutes', 'hours'];
			var maxThreshold = [60, 60];
			var currentUnits = 0;

			while (maxThreshold[currentUnits] && value > maxThreshold[currentUnits])
			{
				value /= maxThreshold[currentUnits];
				currentUnits++;
			}

			returnObj.message = 'Worked for ' + (Math.round(value * 100) / 100) + ' ' + units[currentUnits];
		}

		return returnObj;
	}
};
