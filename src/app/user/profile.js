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
			},
			isfollowing: function($stateParams, apiService){
				return apiService.isfollowing({profile: $stateParams.profileuser});
			}
		}
	}); 
})

.controller('ProfileCtrl', function($scope, $state, apiService, user, profileuser, chronicles, isfollowing){
	$scope.isfollowing = false;
	console.log($scope.isfollowing);
	if(isfollowing === 'null'){
		$scope.isfollowing = false;
	}
	else{
		$scope.isfollowing = true;
	}
	$scope.user = user;
	$scope.profileuser = profileuser;
	$scope.chronicles = chronicles;
	$scope.follow = function(){
		apiService.follow($scope.profileuser._id).then(function(){
			$scope.isfollowing = true;
		});
	};
	$scope.unfollow = function(){
		apiService.unfollow($scope.profileuser._id).then(function(){
			$scope.isfollowing = false;
		});
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