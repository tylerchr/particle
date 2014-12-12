// get started
require('./src/server/bootstrap')();

if (process.argv.length >= 4)
{
	var loader = process.argv[2],
		user = process.argv[3],
		page = 1;

	if (process.argv.length >= 5)
	{
		var pg = parseInt(process.argv[4]);
		if (pg && pg > 0)
		{
			page = pg;
		}
	}

	var loaders = require(__paths.server.loaders);
	loaders.getLoader(loader).load(user, page)
		.then(function() {
			console.log('Done!');
			process.exit();
		});
}
else
{
	console.log('USAGE: node test.js <loader> <user>');
	process.exit();
}
