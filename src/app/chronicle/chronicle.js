angular.module('chronicle.chronicle', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  $stateProvider.state('app.chronicle', {
    url: '{chronicleId:[0-9a-f]{24}}',
    views: {
      main: {
        controller: 'ChronicleCtrl',
        templateUrl: 'chronicle/chronicle.tpl.html',
        resolve: {
          chronicle: function($stateParams, apiService){
            return apiService.chronicle($stateParams.chronicleId).info();
          },
          events: function($stateParams, apiService){
            return apiService.chronicle($stateParams.chronicleId).events();
          }
        }
      }
    }
  });
})

.controller('ChronicleCtrl', function($scope, $state, apiService, chronicle, events) {
  $scope.chronicle = chronicle;
  $scope.events = events;
})

;