angular.module('chronicle.newevent', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  $stateProvider.state('app.chronicle.newevent', {
    url: '/newevent',
    views: {
      main: {
        controller: 'NewEventCtrl',
        templateUrl: 'chronicle/new/newevent.tpl.html',
      }
    }
  });
})

.controller('NewEventCtrl', function($scope, $state, apiService) {
  $scope.$root.$broadcast('scroll-to-event', { title: 'New Event' });
  $scope.create = function(){
    var hue = Math.floor(Math.random()*360);
    var background = "background:hsl(" + hue + ", 50%, 90%)";
    // Sent to apiService
    apiService.chronicle($scope.chronicle._id).newEvent({
      metadata: {
        title: $scope.title,
        names: $scope.names,
        location: $scope.location,
        time: $scope.time,
        description: $scope.description
      },
      color: background,
      content: []
    }).then(function(event){
      $scope.events.push(event);
      $state.go('^.events');
      $scope.$root.$broadcast('scroll-to-event', $scope.events[0]);

    });
  };
})

;