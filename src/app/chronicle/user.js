angular.module('chronicle.user', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  var resolve = {
    user: function($stateParams, apiService){
      return apiService.user($stateParams.userId).info();
    },
    chronicles: function($stateParams, apiService){
      return apiService.user($stateParams.userId).chronicles();
    }
  };
  
  $stateProvider.state('app.user', {
    url: 'user/{userId:[0-9a-f]{24}}',
    resolve: resolve,
    views: {
      main: {
        controller: 'UserCtrl',
        templateUrl: 'chronicle/user.tpl.html',
      },
      topnav: {
        controller: 'UserTopNavCtrl',
        templateUrl: 'chronicle/nav/user-nav.tpl.html',
      }
      /* bottomnav: {
        controller: 'ChronicleBottomNavCtrl',
        templateUrl: 'chronicle/nav/chronicle-timeline-nav.tpl.html'
      } */
    }
  });
})

.controller('UserCtrl', function($scope, $state, apiService, user) {
  $scope.user = user;
  if($state.is('app.user')){
    $state.go($scope.user.chronicles.length ? '.chronicles' : '.newchronicle');
  }
})

.controller('UserTopNavCtrl', function($scope, $state, apiService, user, chronicles) {
})

/* .controller('ChronicleBottomNavCtrl', function($scope, $state, apiService, chronicle, events) {
  $scope.chronicle = chronicle;
  $scope.events = events;
  $scope.event = events[0];

  $scope.totalItems = 64;
  $scope.currentPage = 
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };
  $scope.maxSize = 5;
}) */

;

