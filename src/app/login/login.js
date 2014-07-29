
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
        controller: 'SignupCtrl',
        templateUrl: 'login/signup.tpl.html',
      }
    }
  }); 
})

.controller('LoginCtrl', function($scope, $state, apiService, user){
  if (user._id){
    $state.go('app.chronicles');
  }
  $scope.login = function(){

    console.log($scope.username);
    console.log($scope.password);
    var account = {username: $scope.username, password: $scope.password};
    console.log(account);
    return apiService.login(account).then(function(user){
      $state.go($state.current, {}, {reload: true});
    });
  };
})

.controller('SignupCtrl', function($scope, $state, apiService, user){
  if (user._id){
    $state.go('app.chronicles');
  }
  $scope.signup = function(){
    var account = {name: $scope.name, username: $scope.username, password: $scope.password, email: $scope.email};
    return apiService.signup(account).then(function(user){
      console.log("halp");
      $state.go('app.user', {userId: user._id});
    }).catch(function(results){$scope.unerror= true;});
  };
});