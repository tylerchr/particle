var app = angular.module('particleApp', ['ngRoute', 'btford.socket-io']);

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'pages/timeline.html',
		controller: 'timelineController'
	})
	.when('/data', {
		templateUrl: 'pages/data.html',
		controller: 'dataController'
	})
	.when('/query', {
		templateUrl: 'pages/query.html',
		controller: 'queryController'
	})
	.when('/testing', {
		templateUrl: 'pages/testing.html',
		controller: 'testingController'
	})
	.when('/landing', {
		templateUrl: 'pages/landing.html',
		controller: 'landingController'
	})
	.otherwise({
		redirectTo: '/landing'
	});
});

app.factory('socketChannel', function(socketFactory) {
  return socketFactory();
});

app.controller('particleHeader', [
	'$scope',
	'particleData',
	'socketChannel',
	function($scope, particleData, socketChannel) {

		// prepare for our imminent user challenge thingy
		socketChannel.on('user-challenge', function() {
			particleData.getCurrentUser()
				.then(function(user) {
					socketChannel.emit('user-challenge-response', user);
				});
		});

		$scope.currentUser = {};
		particleData.getCurrentUser()
			.then(function(user) {
				$scope.currentUser = user;
			});

	}
]);

app.controller('timelineController', [
	'$scope',
	'particleData',
	'socketChannel',
	function($scope, particleData, socketChannel) {
		$scope.message = 'Timeline!';

		$scope.currentlyLoading = false;
		$scope.events = [];
		$scope.date = getMidnight();

		// send the server a message
		socketChannel.emit('message', {
			hello: 'world',
			timestamp: new Date()
		});

		socketChannel.on('heartbeat', function() {
			console.log('received a heartbeat');
		});

		reloadData();

		socketChannel.on('newData', function() {
			reloadData();
		});

		function getMidnight(opt_date)
		{
			opt_date = opt_date || (new Date());
			opt_date.setHours(0, 0, 0);
			return opt_date;
		};

		function reloadData()
		{
			$scope.currentlyLoading = true;
			particleData.getTimelineView($scope.date)
				.then(function(events) {
					$scope.events = events;
					$scope.currentlyLoading = false;
				});
		}

		$scope.previousDay = function()
		{
			if (!$scope.currentlyLoading)
			{
				$scope.date.setDate($scope.date.getDate() - 1);
				reloadData();
			}
		};
		$scope.nextDay = function()
		{
			if (!$scope.currentlyLoading)
			{
				$scope.date.setDate($scope.date.getDate() + 1);
				reloadData();
			}
		};

		$scope.toToday = function()
		{
			if (!$scope.currentlyLoading)
			{
				$scope.date = getMidnight();
				reloadData();
			}
		};
	}
]);

app.controller('dataController', function($scope, $routeParams) {
	$scope.message = 'Look! I am a data page.';
	$scope.ticker = 0;

	// socket.on('data-count', function(data) {
	// 	$scope.ticker = data.count;
	// 	$scope.$apply();
	// });
})

app.controller('queryController', function($scope) {
	$scope.message = 'Contact us! Jk this is just a demo';
});

app.controller('testingController', function($scope, particleData) {
	$scope.message = 'Use this page to test the Particle API';
	$scope.sendClick = function()
	{
		console.log("Click Sent!!");
		particleData.sendClick();
	}
});

app.controller('landingController', function($scope){
	$scope.message = 'Testing';
	$scope.$on('$routeChangeSuccess', function(scope, next, current){
		$(".parallax").clove({
			property: "background-position-y",
			min: 350,
			max: 2000,
			easing: function(x, t, b, c, d)
			{
				return x;
			}
		});
	})
});
