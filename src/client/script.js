var app = angular.module('particleApp', ['ngRoute', 'btford.socket-io', 'angularMoment']);

app.config(function($routeProvider) {
	$routeProvider.when('/timeline', {
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
	.otherwise({
		redirectTo: '/timeline'
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

		$scope.currentlyLoading = false;
		$scope.events = [];
		$scope.date = getMidnight();

		reloadData();

		// reload the data when new things become available
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

app.controller('dataController', [
	'$scope',
	'particleData',
	'socketChannel',
	function($scope, particleData, socketChannel) {

		function updateGraph()
		{
			var startDate = new Date("2014-01-01"),
				endDate = new Date();

			particleData.getTimeSeries(startDate, endDate)
				.then(function(data) {

					data_graphic({
						title: "This Year",
						// description: "This is a simple line chart. You can remove the area portion by adding <i>area: false</i> to the arguments list.",
						data: convert_dates(data, 'date'),
						width: 840,
						height: 120,
						// right: 40,
			            min_x: new Date('2014-01-01'),
			            max_x: new Date('2014-12-31'),
						// baselines: fake_baselines,
						target: '#histogram',
						x_accessor: 'date',
						y_accessor: 'value',
						animate_on_load: true
					});

				});
		}

		updateGraph();

		function updateData()
		{
			particleData.getCounts($scope.date)
				.then(function(counts) {
					$scope.counts = counts;
					$scope.ticker = 0;
					counts.forEach(function(item){

						$scope.ticker += item.count;

					});
				});
		}

		updateData();

		socketChannel.on('newData', function() {
			updateData();
		});
	}
]);

app.controller('queryController', function($scope) {
	$scope.message = 'Contact us! Jk this is just a demo';
});

app.controller('testingController', function($scope, particleData) {
	$scope.message = 'Use this page to test the Particle API';
	$scope.date = getMidnight();

	function getMidnight(opt_date)
	{
		opt_date = opt_date || (new Date());
		opt_date.setHours(0, 0, 0);
		return opt_date;
	};

	$scope.sendClick = function()
	{
		console.log("Click Sent!!");
		particleData.sendClick();
		$scope.data = null;
	}

	$scope.getData = function()
	{
		particleData.getTimelineView($scope.date)
			.then(function(events) {
				$scope.data = JSON.stringify(events, undefined, 2);
				$scope.currentlyLoading = false;
			});
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
