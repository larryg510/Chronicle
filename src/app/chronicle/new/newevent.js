angular.module('chronicle.newevent', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  
  $stateProvider.state('app.chronicle.new', {
    url: '/new',
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
    //todo: send to apiService
    apiService.chronicle($scope.chronicle._id).newEvent({
      title: $scope.title,
      names: $scope.names,
      location: $scope.location,
      time: $scope.time,
      description: $scope.description
    }).then(function(event){
      $scope.events.push(event);
      $state.go('^.events');
    });
  };
})

;