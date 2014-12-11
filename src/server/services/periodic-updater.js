var CronJob = require('cron').CronJob,
	Promise = require('bluebird'),
	loader = require(__paths.server.loaders);

var jobs = [
	{ user: 'tylerchr', service: 'lastfm', cron: '*/60 * * * * *' }
];


function beginAllJobs()
{
	jobs.forEach(function(job) {
		if (!job.__cronjob)
		{
			job.__cronjob = new CronJob(job.cron, function(){

				if (!job.inProgress)
				{
					job.inProgress = true;
					console.log('Running job %s for %s', job.service, job.user);
					loader.getLoader(job.service).load(job.user)
						.then(function() {
							console.log('Finished job!');
							job.lastFinished = new Date();
						})
						.catch(function() {
							console.error('Failed to complete the job');
						})
						.finally(function() {
							job.inProgress = false;
						});
				}
				else
				{
					console.log('Job in progress, skipping for this tick...');
				}

			}, null, true, "America/Denver");
		}
		job.__cronjob.start();
	});
}

module.exports = {
	beginUpdating: beginAllJobs,
	stopUpdating: function()
	{
		jobs.forEach(function(job) {
			if (job.__cronjob)
			{
				job.__cronjob.stop();
			}
		});
	}
};