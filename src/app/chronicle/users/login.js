
angular.module('chronicle.login', [
	'chronicle.api',
	'ui.router',
	'ui.bootstrap'
])

.config(function($stateProvider) {
  $stateProvider.state('app.chronicle.login', {
    url: '/login',
    views: {
      'main@app.chronicle': {
        controller: 'LoginCtrl',
        templateUrl: 'chronicle/users/login.tpl.html',
      }
    }
  });
  $stateProvider.state('app.chronicle.signup', {
    url: '/signup',
    views: {
      main: {
        controller: 'LoginCtrl',
        templateUrl: 'chronicle/users/signup.tpl.html',
      }
    }
  }); 
})

.controller('LoginCtrl', function($scope, $state, apiService){
});