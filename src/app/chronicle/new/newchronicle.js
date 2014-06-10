angular.module('chronicle.newchronicle', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  $stateProvider.state('app.chronicle.newchronicle', {
    url: '/newchronicle',
    views: {
      main: {
        controller: 'NewChronicleCtrl',
        templateUrl: 'chronicle/new/newchronicle.tpl.html',
      }
    }
  });
})

.controller('NewChronicleCtrl', function($scope, $state, apiService) {
  $scope.$root.$broadcast('scroll-to-event', { title: 'New Chronicle' });
  $scope.create = function(){
    var hue = Math.floor(Math.random()*360);
    var background = "background:hsl(" + hue + ", 50%, 90%)";
    // Sent to apiService
    apiService.chronicle($scope.chronicle._id).newEvent({
      title: $scope.metadata.title,
      names: $scope.metadata.names,
      location: $scope.metadata.location,
      time: $scope.metadata.time,
      description: $scope.metadata.description,
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