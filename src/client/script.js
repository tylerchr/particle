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
	.when('/login', {
		templateUrl: 'pages/login.html',
		controller: 'loginController'
	})
	.when('/signup', {
		templateUrl: 'pages/signup.html',
		controller: 'signupController'
	})
	.otherwise({
		redirectTo: '/landing'
	});
});

app.controller('timelineController', ['$scope', 'particleData', function($scope, particleData) {
	$scope.message = 'Timeline!';

	$scope.today = new Date();
	$scope.events = [];

	particleData.getTimelineView()
		.then(function(events) {
			$scope.events = events;
		});

	// $scope.events = [
	// 	{
	// 		timestamp: new Date(1417304556280), // Nov 29, 4:42 pm
	// 		title: 'Listened to "Something I Need"',
	// 		message: 'OneRepublic, "Native"'
	// 	},
	// 	{
	// 		timestamp: new Date(1417304382849), // Nov 29, 4:39 pm
	// 		title: 'Listened to "Bigger Than Love"',
	// 		message: 'My Favorite Highway, "How To Call A Bluff"'
	// 	}
	// ];
}]);

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

app.controller('loginController', function($scope){
	$scope.login = function() {
		alert("Not implemented");
	}
});

app.controller('signupController', function($scope){
	$scope.signup = function() {

		// Validate Input
		var email = $("#email").val();
		var password = $("#password").val();
		var verifyPassword = $("#verify-password").val();
		var firstName = $("#first-name").val();
		var lastName = $("#last-name").val();
		$scope.errorMessages = [];

		if (email == "" || password == "" || verifyPassword == "" || firstName == "" || lastName == "")
		{
			$scope.errorMessages[$scope.errorMessages.length] = "Some required fields are missing";
		}

		if ( password !== verifyPassword)
		{
			$scope.errorMessages[$scope.errorMessages.length] = "Password do not match!";
		}

		// Check if user exists
		// Create user
		
		alert("Not Implemented");

	}
});