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
    url: 'user/{userId}',
    resolve: resolve,
    views: {
      main: {
        controller: 'UserCtrl',
        templateUrl: 'user/user.tpl.html',
      },
      topnav: {
        controller: 'UserNavCtrl',
        templateUrl: 'user/user-nav.tpl.html',
      }
      /* bottomnav: {
        controller: 'ChronicleBottomNavCtrl',
        templateUrl: 'chronicle/nav/chronicle-timeline-nav.tpl.html'
      } */
    }
  });

  $stateProvider.state('app.settings', {
    url: 'settings',
    //resolve: resolve, 
    views: {
      main: {
        controller: 'SettingsCtrl', 
        templateUrl:'user/settings.tpl.html',
      },
      topnav: {
        controller: 'UserNavCtrl',
        templateUrl: 'user/user-nav.tpl.html'
      }
    }
  });
})

.controller('UserCtrl', function($scope, $state, apiService, user, chronicles) {
  $scope.state = $state;
  $scope.user = user;
  if($state.is('app.user')){
    $state.go(chronicles.length ? '^.chronicles' : 'app.newchronicle');
  }
})

.controller('UserNavCtrl', function($scope, $state, apiService, user, chronicles) {
  $scope.user = user;
  console.log("please");
  $scope.logout = function(){
    console.log($scope.user);
    apiService.logout($scope.user);
    $state.go('app.login');
  };
})

.controller('SettingsCtrl', function($scope, $state, apiService, user){
  $scope.user = user;
  console.log(user);
  $scope.edituser = function() {
    console.log($scope.user);
    apiService.edituser($scope.user);
    $state.go('app.chronicles');
  };
  $scope.editprofile = function() {
    apiService.editprofile($scope.user);
    $state.go('app.chronicles');
  };
  $scope.settab = function(chosentab){
    $scope.currenttab = chosentab;
  };
  $scope.istab = function(settab){
    return $scope.currenttab == settab;
  };
  $scope.editpass = function() {
    // console.log($scope.password);
    if ($scope.user.password == $scope.oldpassword){
      return apiService.editpass($scope.password).then(function(){
        $scope.user.password = $scope.password;
        $state.go('app.chronicles');
      });
    }
    else{$scope.wrongpass = true;}
  };
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

