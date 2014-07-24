angular.module('chronicle.updates', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider){
	$stateProvider.state('app.updates', {
		url: 'updates',
		views: {
			main: {
				controller: 'UpdatesCtrl',
				templateUrl: 'updates/updates.tpl.html'
			},
			topnav: {
				controller : 'UserNavCtrl',
				templateUrl: 'user/user-nav.tpl.html'
			}
		},
		resolve: {
			updates: function($stateParams, apiService){
				return apiService.updates();
			}
		}

	});

})

.controller('UpdatesCtrl', function($scope, $state, apiService, user, updates){
	$scope.user = user;
	$scope.updates = updates;
	console.log($scope.updates);
	$scope.myupdates = updates.filter(function(update){
		return $scope.user._id !== update.user._id && update.read.indexOf($scope.user._id) == -1;
	});
	console.log($scope.myupdates);

})

.controller('UserNavCtrl', function($scope, $state, apiService, user){
	$scope.state = $state;
	console.log("Wat");
	$scope.user = user;
	$scope.logout = function(){
		console.log($scope.user);
		apiService.logout($scope.user);
		$state.go('app.login');
	};
});