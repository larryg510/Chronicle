angular.module('chronicle.editevent', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  $stateProvider.state('app.chronicle.event.edit', {
    url: '/edit',
    views: {
      'main@app.chronicle': {
        controller: 'EditEventCtrl',
        templateUrl: 'chronicle/new/editevent.tpl.html',
      }
    }
  });

  $stateProvider.state('app.chronicle.newevent', {
    url: '/newevent',
    views: {
      main: {
        controller: 'EditEventCtrl',
        templateUrl: 'chronicle/new/editevent.tpl.html',
      }
    }
  }); 
})

.controller('EditEventCtrl', function($scope, $state, apiService) {
  if($state.params.eventId){
    //todo search for event in chronicle VVVV ????? 
    /* for(var i = 0; i < $scope.chronicle.events.length; i++){
      if($scope.chronicle.events[i]._id === $state.params.eventId) {
        $scope.metadata = $scope.chronicle.events[i].metadata; 
      }
    }*/
    $scope.events.forEach(function(event){
    if(event._id == $state.params.eventId) {
      $scope.event = event;
    }
  });

  } else {
    $scope.$root.$broadcast('scroll-to-event', { title: 'New Event' });
    $scope.event = {};
  }

  $scope.modify = function(){
    // Sent to apiService

    if($scope.event._id){
      return apiService.chronicle($scope.chronicle._id).event($scope.event._id).update($scope.event.metadata).then(function(){
        $state.go('^');
        $scope.$root.$broadcast('scroll-to-event', event);
      });
    }else {
      return apiService.chronicle($scope.chronicle._id).newEvent($scope.event.metadata).then(function(event){
        $scope.events.push(event);
        $state.go('^.events');
        $scope.$root.$broadcast('scroll-to-event', event);
      });
    }
  };
})

;