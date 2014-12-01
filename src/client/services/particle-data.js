angular.module('particleApp')
	.factory('particleData', ['$http', function($http) {

		return {
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
			}
		};

	}]);