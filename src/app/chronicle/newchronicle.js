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

  $stateProvider.state('app.chronicle.edit', {
    url: '/edit',
    views: {
      main : {
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

.controller('NewChronicleCtrl', function($scope, $state, apiService, user) {
  $scope.state = $state;
  $scope.public = true;
  $scope.$root.$broadcast('scroll-to-event', { title: 'New Chronicle' });
  
  $scope.user = user;
  if($scope.chronicle){
    $scope.access = ($scope.user._id == $scope.chronicle.user) || ($scope.chronicle.edit.indexOf($scope.user._id) !== -1);
    if(!$scope.access){
      if(!$scope.chronicle.public){
        $state.go('app.chronicles');
      }
      else{
        $state.go('^.events');
      }
    }
  }

  
  $scope.create = function(){
    if($scope.chronicle){
      return apiService.chronicle($scope.chronicle._id).update($scope.title).then(function(){
        $state.go('app.chronicle.events');
      });
    }else {
      var hue = Math.floor(Math.random()*360);
      var background = "background:hsl(" + hue + ", 50%, 90%)";
      
      // sent to apiService
      var chronicle = {
        title: $scope.title,
        events: [],
        public: $scope.public
      };
      
      return apiService.chronicles(chronicle).then(function(chronicle){
        $state.go('app.chronicles');  

      }).catch(function(error){
        alert(error);
      });
    }
  };

  $scope.back = function(){
    $state.go('app.user');
  };
})

.controller('UserNavCtrl', function(){

})
;