var app = angular.module('particleApp', []);

var socket = io.connect();

app.config(function($routeProvider) {
	$routeProvider.when('/', {
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
		redirectTo: '/'
	});
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

app.controller('loginController', function($scope, $routeParams){
	
	var nodeErrors = {
		"login" : "Please login",
		"invalid" : "The username/password you provided was invalid"
	}

	var infoMessages = {
		"signupSuccess" : "You have successfully signed up. Please login"
	}

	console.log($routeParams);

	if($routeParams["error"])
	{	
		$scope.errorMessages = [];
		$scope.errorMessages.push(nodeErrors[$routeParams["error"]])
	}

	if($routeParams["info"])
	{
		$scope.infoMessage = infoMessages[$routeParams["info"]];
	}

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
			"email": $scope.email,
			"password": $scope.password,
			"firstname": $scope.firstname,
			"lastname": $scope.lastname
		};

		var responsePromise = $http.post("/api/v1/user", userData);

		responsePromise.success(function(data, status, headers, config) {
			if(data === "success")
			{
				window.location = "/common/#login?info=signupSuccess";
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