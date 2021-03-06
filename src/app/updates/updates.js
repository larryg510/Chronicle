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
			},
			userupdates: function($stateParams, apiService){
				return apiService.userupdates();
			}
		}

	});

})

.controller('UpdatesCtrl', function($scope, $state, apiService, user, userupdates, updates){
	$scope.user = user;
	$scope.updates = updates;
	//console.log($scope.updates);
	console.log(userupdates);

	$scope.myupdates = updates.concat(userupdates).filter(function(update){
		return $scope.user._id !== update.user._id && update.read.indexOf($scope.user._id) == -1;
	});
	toolongago = function(element){
		return (moment() < moment(element.date).add('days', 7));
	};
	$scope.myupdates = $scope.myupdates.filter(toolongago);
	//console.log("now");
	//console.log($scope.myupdates);

	for(var i in $scope.myupdates){
		//console.log(moment($scope.myupdates[i].date) > moment($scope.myupdates[i].date).subtract('days', 3));
		$scope.myupdates[i].date = moment($scope.myupdates[i].date).fromNow();

	}

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