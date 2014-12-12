var router = require('express').Router({ mergeParams: true }),
	dataApi = require(__paths.server.services + '/data'),
	Chance = require('chance'),
	loaders = require(__paths.server.loaders),
	userSettings = require(__paths.server.services + '/user-settings');

var chance = new Chance(Math.random);

router.get('/counts', function(req, res) {
	var currentUser = req.session.loggedInUser.email;
	dataApi.countDataPoints(currentUser)
		.then(function(counts) {
			res.status(200).send(counts);
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
});

router.get('/click', function(req, res) {
	var currentUser = req.session.loggedInUser.email;

	var defaultSetting = 
	{
		clickType: "random"
	}

	userSettings.getSettings(currentUser, "click", defaultSetting)
		.then(function(settings){

			var message = "";

			switch(settings.clickType)
			{
				case "random": message = chance.sentence(); break;
				case "custom": message = settings.customMessage; break;
			}

			dataApi.saveDataPoint(currentUser, "click", {"sentence" : message}, new Date())
			.then(function(data) {
				res.status(200).send();
			})
			.catch(function(err) {
				console.log(err.stack)
				res.status(500).send(err.message);

			});
		});
});

router.get('/last.fm/update', function(req, res) {
	var currentUser = req.session.loggedInUser.email;
	loaders.getLoader('lastfm').load(currentUser);
	res.status(202).send("started");
});

router.get('/timeline', function(req, res) {

	var startDate;
	if (parseInt(req.query.startDate))
	{
		startDate = new Date(parseInt(req.query.startDate));
	}
	else
	{
		startDate = new Date();
		startDate.setHours(0, 0, 0);
	}

	var endDate;
	if (parseInt(req.query.endDate) && parseInt(req.query.endDate) > startDate.getTime())
	{
		endDate = new Date(parseInt(req.query.endDate));
	}
	else
	{
		endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 1);
	}

	var currentUser = req.session.loggedInUser.email;
	dataApi.getTimelineData(currentUser, startDate, endDate)
		.then(function(points) {
			res.status(200).send(points);
		})
		.catch(function(err) {
			console.error(err.stack);
			res.status(500).send(err.message);
		});
});

module.exports = router;