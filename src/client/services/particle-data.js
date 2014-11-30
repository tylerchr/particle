angular.module('particleApp')
	.factory('particleData', ['$http', function($http) {

		return {
			getTimelineView: function()
			{
				return $http.get('/api/v1/timeline')
					.then(function(response) {
						return response.data;
					});
			}
		};

	}]);