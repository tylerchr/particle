var app = angular.module('particleApp', []);

var socket = io.connect();

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

app.controller('timelineController', function($scope) {
	$scope.message = 'Timeline!';

	$scope.today = new Date();
	$scope.events = [
		{
			date: new Date(1417304556280), // Nov 29, 4:42 pm
			title: 'Listened to "Something I Need"',
			message: 'OneRepublic, "Native"'
		},
		{
			date: new Date(1417304382849), // Nov 29, 4:39 pm
			title: 'Listened to "Bigger Than Love"',
			message: 'My Favorite Highway, "How To Call A Bluff"'
		}
	];
});

app.controller('dataController', function($scope, $routeParams) {
	$scope.message = 'Look! I am a data page.';
	$scope.ticker = 0;

	socket.on('data-count', function(data) {
		$scope.ticker = data.count;
		$scope.$apply();
	});
})

app.controller('queryController', function($scope) {
	$scope.message = 'Contact us! Jk this is just a demo';
});

app.controller('testingController', function($scope) {
	$scope.message = 'Use this page to test the Particle API';
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