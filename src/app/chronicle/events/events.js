angular.module('chronicle.events', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  
  $stateProvider.state('app.user.chronicle.events', {
    url: '/events',
    views: {
      main: {
        controller: 'EventsCtrl',
        templateUrl: 'chronicle/events/events.tpl.html',
      }
      
    }
  });
})

.controller('EventsCtrl', function($scope, $state, apiService) {
  
})

;