
angular.module('chronicle.login', [
	'chronicle.api',
	'ui.router',
	'ui.bootstrap'
])

.config(function($stateProvider) {
  $stateProvider.state('app.login', {
    url: 'login',
    views: {
      main: {
        controller: 'LoginCtrl',
        templateUrl: 'login/login.tpl.html',
      }
    }
  });
  $stateProvider.state('app.signup', {
    url: 'signup',
    views: {
      main: {
        controller: 'LoginCtrl',
        templateUrl: 'login/signup.tpl.html',
      }
    }
  }); 
})

.controller('LoginCtrl', function($scope, $state, apiService){
  $scope.login = function(){
    return apiService.signup($scope.username).then(function(user){
      $state.go('app.user', {userId: user._id});
    });
  };
});