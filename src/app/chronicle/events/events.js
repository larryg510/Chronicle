angular.module('chronicle.events', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap',
  'angular-gestures'
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

.controller('EventsCtrl', function($scope, $state, $modal, apiService, user) {
  $scope.user = user;
  $scope.access = (($scope.user._id == $scope.chronicle.user) || ($scope.chronicle.edit.indexOf($scope.user._id) !== -1) || ($scope.chronicle.read.indexOf($scope.user._id) !== -1));
  if(!($scope.chronicle.public || $scope.access))
  {
    $state.go('app.chronicles');
  }

  $scope.settings = function(event) {
    $scope.event = event;

    var modalInstance = $modal.open({
      templateUrl: 'chronicles/modal.tpl.html',
      scope: $scope,
      controller: function ($scope, $modalInstance) {
        $scope.edit = function () {
          $state.go('app.chronicle.event.edit', { eventId: $scope.event._id });
          $modalInstance.dismiss('cancel');
        }; 

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };

        $scope.delete = function (event) {
          apiService.chronicle($scope.chronicle._id).event($scope.event._id).deleteEvent().then(function(){
            var index = $scope.events.indexOf($scope.event);
            if(index !== -1){
              $scope.events.splice(index, 1);
            }
            $state.go($scope.events.length ? 'app.chronicle.events' : 'app.chronicle.newevent');
            $modalInstance.dismiss('cancel');
          });
        };
      }
    });
  };
})

;