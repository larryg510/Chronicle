angular.module('chronicle.chronicle', [
  'chronicle.event',
  'chronicle.events',
  'chronicle.newchronicle',
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  var resolve = {
    chronicle: function($stateParams, apiService, user){
      return apiService.chronicle($stateParams.chronicleId).info();
    },
    events: function($stateParams, apiService, user){
      return apiService.chronicle($stateParams.chronicleId).events();
    }
  };
  
  $stateProvider.state('app.chronicle', {
    url: 'chronicle/{chronicleId:[0-9a-f]{24}}',
    resolve: resolve,
    views: {
      main: {
        controller: 'ChronicleCtrl',
        templateUrl: 'chronicle/chronicle.tpl.html',
      },
      topnav: {
        controller: 'ChronicleTopNavCtrl',
        templateUrl: 'chronicle/chronicle-nav.tpl.html',
      }
      /* bottomnav: {
        controller: 'ChronicleBottomNavCtrl',
        templateUrl: 'chronicle/nav/chronicle-timeline-nav.tpl.html'
      } */
    }
  });

})

.controller('ChronicleCtrl', function($scope, $state, apiService, chronicle, events, user) {
  $scope.user = user;
  $scope.chronicle = chronicle;
  console.log($scope.chronicle);
  $scope.events = events;
  console.log($scope.events.length);

  $scope.access = (($scope.user._id == $scope.chronicle.user) || ($scope.chronicle.edit.indexOf($scope.user._id) !== -1) || ($scope.chronicle.read.indexOf($scope.user._id) !== -1));
  if(!($scope.chronicle.public || $scope.access)){
    $state.go('app.chronicles');
  }
  else{
    if($state.is('app.chronicle')){
      $state.go($scope.events.length ? '.events' : '.newevent');
    }
  }
})







.controller('ChronicleTopNavCtrl', function($scope, $state, apiService, chronicle, events) {
  $scope.chronicle = chronicle;
  $scope.events = events;
  $scope.event = events[0];
  $scope.$state = $state;

  $scope.delete = function() {
    apiService.chronicle(chronicle._id).delete().then(function(){
      $state.go('app.chronicles');
    });
  };

  $scope.deleteEvent = function() {
    apiService.chronicle(chronicle._id).event($scope.event._id).deleteEvent($scope.event._id).then(function(){
      var index = $scope.events.indexOf($scope.event);
      if(index !== -1){
        $scope.events.splice(index, 1);
      }
      $state.go($scope.events.length ? 'app.chronicle.events' : 'app.chronicle.newevent');
    });
  };

  $scope.miew = function() {
    console.log("miew");
    $state.go("^");
  };
  $scope.logout = function(){
    apiService.logout($scope.user);
    $state.go('app.login');
  };

  $scope.$on('scroll-to-event', function(e, event){
    $scope.event = event;
  });
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

.directive('eventScroller', function(){
  return {
    restrict: 'A',
    scope: {
      events: '=eventScroller'
    },
    link: function(scope, element, attrs){
      var elem = element[0];
      
      elem.addEventListener('scroll', function(e){
        var currentEvent = scope.events[0];
        
        scope.events.forEach(function(event){
          if(elem.getBoundingClientRect().top >= document.getElementById(event._id).getBoundingClientRect().top){
            currentEvent = event;
          }
        });
        
        scope.$apply(function(){
          scope.$root.$broadcast('scroll-to-event', currentEvent);
        });
      });
    }
  };
})

;