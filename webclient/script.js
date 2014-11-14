var app = angular.module('particleApp', []);

var socket = io.connect();

app.config(function($routeProvider) {
	
	$routeProvider.when('/', {
		templateUrl: 'pages/home.html',
		controller: 'mainController'
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
	});
});

app.controller('mainController', function($scope) {
	$scope.message = 'Everyone come and see how good I look!';
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