angular.module('chronicle.follow', [
	'chronicle.api',
	'ui.router',
	'ui.bootstrap',
	'chronicle.user'
])

.config(function($stateProvider){
	$stateProvider.state('app.user.follow', {
		url: '/suscriptions',
		views: {
			main: {
				controller: 'FollowCtrl',
				templateUrl: 'user/follow.tpl.html',
			}, 
			topnav: {
				controller: 'UserNavCtrl',
				templateUrl: 'user/user-nav.tpl.html',
			}
		},
		resolve: {
			usersfollowing: function($stateParams, apiService){
				return apiService.usersfollowing();
			},
			usersfollowed: function($stateParams, apiService){
				return apiService.usersfollowed();
			}
		}
	}); 
})

.controller('FollowCtrl', function($scope, $state, apiService, user, usersfollowing, usersfollowed){
	$scope.usersfollowing = usersfollowing;
	console.log($scope.usersfollowing);
	$scope.usersfollowed = usersfollowed;
	console.log($scope.usersfollowed);
	$scope.user = user;
	$scope.currenttab = 1;
	$scope.settab = function(chosentab){
		$scope.currenttab = chosentab;
	};
	$scope.istab = function(settab){
		return $scope.currenttab == settab;
	};
	
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