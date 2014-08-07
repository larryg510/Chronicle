angular.module('chronicle.users', [
	'chronicle.api',
	'ui.router',
	'ui.bootstrap'
])

.config(function($stateProvider){
	var resolve = {
		users : function($stateParams, apiService){
			return apiService.retrieveusers();
		}
	};

$stateProvider.state('app.users', {
	url: 'users',
	resolve: resolve,
	views: {
		main: {
			controller: 'UsersCtrl',
			templateUrl: 'users/users.tpl.html'
		},
		topnav: {
			controller: 'UserNavCtrl',
			templateUrl: 'user/user-nav.tpl.html'
		}
	}
	});
})

.controller('UsersCtrl', function($scope, $state, apiService, users, user) {
	$scope.user = user;
	$scope.users = users;
})

.controller('UserNavCtrl', function($scope, $state, apiService, user, chronicles) {
  $scope.user = user;
  console.log("please");
  $scope.logout = function(){
    console.log($scope.user);
    apiService.logout($scope.user);
    $state.go('app.login');
  };
});