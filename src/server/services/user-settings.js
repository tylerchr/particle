var Promise = require('bluebird');

module.exports = {
	getSettings: function(user, service)
	{
		if (user == 'tyler9xp@gmail.com' && service == 'lastfm')
		{
			return Promise.resolve({
				username: 'tyler9xp',
				apiKey: '549cedf90bd7afd5e7883f9f7516ea42'
			});
		}
		else if (user == 'tyson.decker@gmail.com' && service == 'lastfm')
		{
			return Promise.resolve({
				username: 'tysondecker',
				apiKey: '549cedf90bd7afd5e7883f9f7516ea42'
			});
		}
		else if (user == 'tyler9xp@gmail.com' && service == 'timeclock')
		{
			return Promise.resolve({
				employeeId: 'TYLERC',
				workplace: 'Qualtrics'
			});
		}
		else
		{
			return Promise.reject('Settings not found');
		}
	}
};