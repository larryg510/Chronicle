angular.module('chronicle.chronicle', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  var resolve = {
    chronicle: function($stateParams, apiService){
      return apiService.chronicle($stateParams.chronicleId).info();
    },
    events: function($stateParams, apiService){
      return apiService.chronicle($stateParams.chronicleId).events();
    }
  };
  
  $stateProvider.state('app.chronicle', {
    url: '{chronicleId:[0-9a-f]{24}}',
    resolve: resolve,
    views: {
      main: {
        controller: 'ChronicleCtrl',
        templateUrl: 'chronicle/chronicle.tpl.html',
      },
      nav: {
        controller: 'ChronicleNavCtrl',
        templateUrl: 'chronicle/chronicle-nav.tpl.html',
      }
    }
  });
})

.controller('ChronicleCtrl', function($scope, $state, apiService, chronicle, events) {
  $scope.chronicle = chronicle;
  $scope.events = events;

  if($state.is('app.chronicle')){
    $state.go($scope.events.length ? '.events' : '.new');
  }
})

.controller('ChronicleNavCtrl', function($scope, $state, apiService, chronicle, events) {
  $scope.chronicle = chronicle;
  $scope.events = events;
  $scope.event = events[0];
  
  $scope.$on('scroll-to-event', function(e, event){
    $scope.event = event;
  });
})

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