angular.module('chronicle.profile', [
	'chronicle.api',
	'ui.router',
	'ui.bootstrap',
	'chronicle.user'
])

.config(function($stateProvider){
	$stateProvider.state('app.user.profile', {
		url: 'profile',
		views: {
			main: {
				controller: 'ProfileCtrl',
				templateUrl: 'user/profile.tpl.html',
			}, 
			topnav: {
				controller: 'UserNavCtrl',
				templateUrl: 'user/user-nav.tpl.html',
			}
		},
		resolve: {
			chronicles: function($stateParams, apiService){
				return apiService.profilechronicles({userId: $stateParams.userId});
			}
		}
	}); 
})

.controller('ProfileCtrl', function($scope, $state, apiService, user, chronicles){
	$scope.user = user;
	console.log($scope.user);
	$scope.chronicles = chronicles;
	console.log($scope.chronicles);
})

.controller('UserNavCtrl', function($scope, $state, apiService, user) {
  $scope.user = user;
  console.log("please");
  $scope.logout = function(){
    console.log($scope.user);
    apiService.logout($scope.user);
    $state.go('app.login');
  };
});