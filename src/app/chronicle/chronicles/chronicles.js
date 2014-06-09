angular.module('chronicle.chronicles', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  
  $stateProvider.state('app.chronicle.chronicles', {
    url: '/chronicles',
    views: {
      main: {
        controller: 'ChroniclesCtrl',
        templateUrl: 'chronicle/chronicles/chronicles.tpl.html',
      }
      
    }
  });
})

.controller('ChroniclesCtrl', function($scope, $state, apiService) {
  
})

;