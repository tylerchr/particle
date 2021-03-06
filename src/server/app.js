// get started
require('./bootstrap')();

var express = require('express'),
	bodyParser = require('body-parser'),
	git = require('git-rev'),
	_ = require('underscore'),
	socketManager = require(__paths.server.services + '/socket-manager'),
	path = require('path'),
	http = require('http'),
	cookieParser = require('cookie-parser'),
	session = require('express-session');

git.short(function(rev) {
	console.log('Current revision: ' + rev);
});

function checkAuth(req, res, next)
{
	if (!req.session.loggedInUser)
	{
		res.redirect("/common/#login?error=login");
	}
	else
	{
		next();
	}
}

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({secret : 'TYLERISAFATPIG',
				saveUninitialized: true,
                resave: true}));

app.get('/', function(req, res){
	res.redirect('/common');
});

app.use('/common', express.static(__paths.common));
app.use('/app', checkAuth);
app.use('/app', express.static(__paths.client));

// set up some routes
var dataRoutes = require(__paths.server.routes + '/data-routes');
var userRoutes = require(__paths.server.routes + '/user-routes');

// require authentication for all but a select few routes
app.use(function(req, res, next) {
	var unprotectedRoutes = ['/api/v1/login', '/api/v1/logout', '/api/v1/user'];
	if (!req.session.loggedInUser && unprotectedRoutes.indexOf(req.path) == -1)
	{
		res.status(403).send('Unauthorized');
	}
	else
	{
		next();
	}
});

app.use('/api/v1', dataRoutes);
app.use('/api/v1', userRoutes);

var port = 8080,
	server = http.Server(app);

server.listen(port, function() {
	console.log('Server started on port ' + port);
});

socketManager.init(server);