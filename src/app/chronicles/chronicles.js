angular.module('chronicle.chronicles', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  
  $stateProvider.state('app.chronicles', {
    url: 'chronicles',
    views: {
      main: {
        controller: 'ChroniclesCtrl',
        templateUrl: 'chronicles/chronicles.tpl.html',
      },
      topnav: {
        controller: 'UserNavCtrl',
        templateUrl: 'user/user-nav.tpl.html',
      }
    }, 
    resolve: {
      chronicles: function($stateParams, apiService){
        return apiService.chronicles();
      }
    }
  });

  $stateProvider.state('app.user.chronicles', {
    url: '/chronicles',
    views: {
      main: {
        controller: 'ChroniclesCtrl',
        templateUrl: 'chronicles/chronicles.tpl.html',
      }
      
    }
  });

  $stateProvider.state('app.owned', {
    url: 'chronicles/owned',
    views: {
      main: {
        controller: 'ChroniclesCtrl',
        templateUrl: 'chronicles/chronicles.tpl.html'
      },
      topnav: {
        controller: 'UserNavCtrl',
        templateUrl: 'user/user-nav.tpl.html',
      }
    },
    resolve: {
      chronicles: function($stateParams, apiService){
        return apiService.mychronicles();
      }
    }
  });
})

.controller('ChroniclesCtrl', function($scope, $state, apiService, user, chronicles) {
  $scope.chronicles = chronicles;
})

.controller('UserNavCtrl', function(){

})
;