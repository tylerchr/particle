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

	$scope.currentlyLoading = false;
	$scope.events = [];
	$scope.date = getMidnight();

	reloadData();

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

		$scope.errorMessages = [];

		if(!$scope.email || !$scope.password)
		{
			$scope.errorMessages.push("Some required fields are missing");
		}

		if ($scope.errorMessages.length > 0)
		{
			return;
		}
		

		document.forms.loginForm.submit();

		
	}
});

app.controller('signupController', function($scope, $http){


	$scope.signup = function() {

		// Validate Input
		$scope.errorMessages = [];

		if (!$scope.email || !$scope.password || !$scope.verifyPassword || !$scope.firstname || !$scope.lastname)
		{
			$scope.errorMessages.push("Some required fields are missing");
		}

		if ( $scope.password !== $scope.verifyPassword)
		{
			$scope.errorMessages.push("Password do not match!");
		}

		if ($scope.errorMessages.length > 0)
		{
			return;
		}

		// Create user
		var userData = {
			"username": $scope.email,
			"password": $scope.password,
			"firstname": $scope.firstname,
			"lastname": $scope.lastname
		};

		var responsePromise = $http.post("/api/v1/user", userData);

		responsePromise.success(function(data, status, headers, config) {
			if(data === "success")
			{
				window.location = "/#";
			}
			else {
				$scope.errorMessages.push(data);
			}
		});
		
		responsePromise.error(function(data, status, headers, config) {
			alert(data, status, headers);
		});

	}
});