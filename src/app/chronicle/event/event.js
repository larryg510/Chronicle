angular.module('chronicle.event', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  
  $stateProvider.state('app.chronicle.event', {
    url: '{eventId:[0-9a-f]{24}}',
    views: {
      main: {
        controller: 'EventCtrl',
        templateUrl: 'chronicle/event/event.tpl.html',
      }
    }
  });
})

.controller('EventCtrl', function($scope, $state, apiService) {
  $scope.events.forEach(function(event){
    if(event._id == $state.params.eventId) {
      $scope.event = event;
    }
  });
  $scope.$root.$broadcast('scroll-to-event', $scope.event);
})

;