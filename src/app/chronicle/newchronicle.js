angular.module('chronicle.newchronicle', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  $stateProvider.state('app.newchronicle', {
    url: 'newchronicle',
    views: {
      main: {
        controller: 'NewChronicleCtrl',
        templateUrl: 'chronicle/newchronicle.tpl.html',
      },
      topnav: {
        controller: 'UserNavCtrl',
        templateUrl: 'user/user-nav.tpl.html',
      }
    }
  });
})

.controller('NewChronicleCtrl', function($scope, $state, apiService) {
  $scope.state = $state;

  $scope.$root.$broadcast('scroll-to-event', { title: 'New Chronicle' });
  
  $scope.create = function(){
    
    var hue = Math.floor(Math.random()*360);
    var background = "background:hsl(" + hue + ", 50%, 90%)";
    
    // sent to apiService
    var chronicle = {
      title: $scope.title,
      events: []
    };
    
    return apiService.chronicles(chronicle).then(function(chronicle){
      $state.go('app.chronicles');  

    }).catch(function(error){
      alert(error);
    });
  };
})

.controller('UserNavCtrl', function(){

})
;