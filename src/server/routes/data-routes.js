var router = require('express').Router({ mergeParams: true }),
	dataApi = require(__paths.server.services + '/data');

router.get('/timeline', function(req, res) {
	dataApi.getTimelineData()
		.then(function(points) {
			res.status(200).send(points);
		})
		.catch(function(err) {
			res.status(500).send(err.message);
		});
});

module.exports = router;