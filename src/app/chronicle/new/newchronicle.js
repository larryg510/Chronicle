angular.module('chronicle.newchronicle', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  $stateProvider.state('app.user.newchronicle', {
    url: '/newchronicle',
    views: {
      main: {
        controller: 'NewChronicleCtrl',
        templateUrl: 'chronicle/new/newchronicle.tpl.html',
      }
    }
  });
})

.controller('NewChronicleCtrl', function($scope, $state, apiService, chronicles) {

  $scope.$root.$broadcast('scroll-to-event', { title: 'New Chronicle' });
  
  $scope.create = function(){
    
    var hue = Math.floor(Math.random()*360);
    var background = "background:hsl(" + hue + ", 50%, 90%)";
    
    // sent to apiService
    var chronicle = {
      title: $scope.title,
      events: []
    };
    
    return apiService.newChronicle(chronicle).then(function(chronicle){
      chronicles.push(chronicle);
      $state.go('^.chronicles');  

    }).catch(function(error){
      alert(error);
    });
  };
})

;