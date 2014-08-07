angular.module('chronicle.profile', [
	'chronicle.api',
	'ui.router',
	'ui.bootstrap',
	'chronicle.user'
])

.config(function($stateProvider){
	$stateProvider.state('app.user.profile', {
		url: '/profile/{profileuser}',
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
				return apiService.profilechronicles({userId: $stateParams.profileuser});
			},
			profileuser: function($stateParams, apiService){
				return apiService.user($stateParams.profileuser).info();
			}
		}
	}); 
})

.controller('ProfileCtrl', function($scope, $state, apiService, user, profileuser, chronicles){
	$scope.user = user;
	$scope.profileuser = profileuser;
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