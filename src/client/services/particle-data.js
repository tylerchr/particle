angular.module('particleApp')
	.factory('particleData', ['$http', function($http) {

		return {
			getCurrentUser: function()
			{
				return $http.get('/api/v1/user')
					.then(function(response) {
						return response.data;
					});
			},
			getTimelineView: function(startDate)
			{
				return $http.get('/api/v1/timeline', {
						params: {
							startDate: startDate.getTime()
						}
					})
					.then(function(response) {
						return response.data;
					});
			},
			getTimeSeries: function()
			{
				return $http.get('/api/v1/timeSeries')
					.then(function(response) {
						return response.data;
					});
			},
			sendClick: function()
			{
				return $http.get('/api/v1/click')
					.then(function(response) {
						return response.data;
					});
			},
			getCounts: function()
			{
				return $http.get('/api/v1/counts')
					.then(function(response) {
						return response.data;
					});
			}

		};

	}]);