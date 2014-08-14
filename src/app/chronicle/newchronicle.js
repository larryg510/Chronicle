angular.module('chronicle.newchronicle', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap',
  'filereader'
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
    $scope.first = false;
    $scope.editaccess = ($scope.user._id == $scope.chronicle.user._id) || ($scope.chronicle.edit.indexOf($scope.user._id) !== -1);
    $scope.readaccess = ($scope.chronicle.read.indexOf($scope.user._id) !== -1);
    console.log($scope.editaccess);
    if(!$scope.editaccess){
      if(!$scope.chronicle.public){
        if($scope.readaccess){
          $state.go('app.chronicle.events');
        }
        else{
          $state.go('app.chronicles');
        }
      }
      else{
        $state.go('^.events');
      }
    }
  }
  else{
    $scope.first = true;
  }

  $scope.searchUsers = function(search){
    return apiService.users(search);
  };
  $scope.adduser = function() {
    if($scope.read){
      apiService.chronicle($scope.chronicle._id).readaccess($scope.read).then(function(){
        //have it reload the page
      });
    }
    if($scope.edit){
      apiService.chronicle($scope.chronicle._id).editaccess($scope.edit).then(function(){
        //have it reload the page
        //maybe I should have page reloaded at the end of adduser
      });
    }
    $state.go($state.current, {}, {reload: true});
  };

  $scope.create = function(){
    console.log($scope.chronicle.photo);
    console.log($scope.public);
    if($scope.chronicle._id){
      return apiService.chronicle($scope.chronicle._id).update({title: $scope.chronicle.title, public: $scope.public, photo: $scope.chronicle.photo}).then(function(){
        //update the update array within Users for use in notifications
        $state.go('app.chronicles');

      });
    }else {

      var hue = Math.floor(Math.random()*360);
      var background = "background:hsl(" + hue + ", 50%, 90%)";
      //console.log($scope.title);
      
      // sent to apiService
      var chronicle = {
        title: $scope.chronicle.title,
        events: [],
        public: $scope.public,
        photo: $scope.chronicle.photo
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

.controller('UserNavCtrl', function($scope, $state, apiService, user){
  $scope.user = user;
  $scope.logout = function(){
    console.log($scope.user);
    apiService.logout($scope.user);
    $state.go('app.login');
  };


})
;