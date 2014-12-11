var fs = require('fs'),
	path = require('path');

module.exports = {
	getLoader: function(loader)
	{
		var potentialPath = path.normalize(path.join(__dirname, loader + '.js'));
		if (fs.existsSync(potentialPath))
		{
			return require(potentialPath);
		}
		else
		{
			console.log("No such loader: " + potentialPath);
		}
	}
};