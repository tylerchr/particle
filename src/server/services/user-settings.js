var Promise = require('bluebird');

module.exports = {
	getSettings: function(user, service)
	{
		if (user == 'tylerchr' && service == 'lastfm')
		{
			return Promise.resolve({
				username: 'tyler9xp',
				apiKey: '549cedf90bd7afd5e7883f9f7516ea42'
			});
		}
		else if (user == 'tylerchr' && service == 'timeclock')
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