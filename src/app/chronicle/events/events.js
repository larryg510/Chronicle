angular.module('chronicle.events', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  
  $stateProvider.state('app.chronicle.events', {
    url: '/events',
    views: {
      main: {
        controller: 'EventsCtrl',
        templateUrl: 'chronicle/events/events.tpl.html',
      }
      
    }
  });
})

.controller('EventsCtrl', function($scope, $state, apiService, user) {
  $scope.user = user;
  $scope.access = (($scope.user._id == $scope.chronicle.user) || ($scope.chronicle.edit.indexOf($scope.user._id) !== -1) || ($scope.chronicle.read.indexOf($scope.user._id) !== -1));
  if(!($scope.chronicle.public || $scope.access))
  {
    $state.go('app.chronicles');
  }

  $scope.searchUsers = function(search){
    return apiService.users(search);
  };
  $scope.adduser = function() {
    console.log("omgmiew");
    console.log($scope.read);
    if($scope.read){
      apiService.chronicle($scope.chronicle._id).readaccess($scope.read).then(function(){
        //have it reload the page
      });
    }
    if($scope.edit){
      apiService.chronicle($scope.chronicle._id).editaccess($scope.edit).then(function(){
        //have it reload the page
        //maybe I should have page reloaded at the end of adduser
      });
    }
  };
})

;