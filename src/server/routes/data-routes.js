var router = require('express').Router({ mergeParams: true }),
	dataApi = require(__paths.server.services + '/data'),
	Chance = require('chance');

var chance = new Chance(Math.random);

router.use(function(req, res, next) {
	if (!req.session.loggedInUser && req.path != '/login')
	{
		res.status(403).send('Unauthorized');
	}
	else
	{
		next();
	}
});

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

	dataApi.saveDataPoint(currentUser, "click", {"sentence" : chance.sentence()}, new Date())
		.then(function(data) {
			res.status(200).send();
		})
		.catch(function(err) {
			console.log(err.stack)
			res.status(500).send(err.message);

		});
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

router.get('/timeSeries', function(req, res) {

	var startDate = (parseInt(req.query.startDate) ? new Date(parseInt(req.query.startDate)) : new Date("2014-01-01")),
		endDate = (parseInt(req.query.endDate) ? new Date(parseInt(req.query.endDate)) : new Date());

	var currentUser = req.session.loggedInUser.email;
	dataApi.getTimeSeriesData(currentUser, startDate, endDate)
		.then(function(data) {
			res.status(200).send(data);
		})
		.catch(function(err) {
			console.error(err.stack);
			res.status(500).send(err.message);
		});
});

module.exports = router;