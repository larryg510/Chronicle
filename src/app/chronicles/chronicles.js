  angular.module('chronicle.chronicles', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap',
  'angular-gestures'
])

.config(function($stateProvider) {
  
  $stateProvider.state('app.chronicles', {
    url: 'chronicles',
    views: {
      main: {
        controller: 'ChroniclesCtrl',
        templateUrl: 'chronicles/mychronicles.tpl.html',
      },
      topnav: {
        controller: 'UserNavCtrl',
        templateUrl: 'user/user-nav.tpl.html',
      }
    }, 
    resolve: {
      user: function($stateParams, apiService){
      return apiService.user($stateParams.userId).info();
      },
      chronicles: function($stateParams, apiService){
        return apiService.chronicles();
      },
      publicchronicles: function($stateParams, apiService){
        return apiService.public();
      }
    }
  });

  $stateProvider.state('app.user.chronicles', {
    url: '/chronicles',
    views: {
      main: {
        controller: 'ChroniclesCtrl',
        templateUrl: 'chronicles/chronicles.tpl.html',
      }, 
      topnav: {
        controller: 'UserNavCtrl',
        templateUrl: 'user/user-nav.tpl.html',
      }
    }
  });

  $stateProvider.state('app.public', {
    url: 'public',
    views: {
      main: {
        controller: 'PublicChroniclesCtrl',
        templateUrl: 'chronicles/chronicles.tpl.html'
      },
      topnav: {
        controller: 'UserNavCtrl',
        templateUrl: 'user/user-nav.tpl.html',
      }
    },
    resolve: {
      chronicles: function($stateParams, apiService){
        return apiService.public();
      }
    }
  });
})

.controller('ChroniclesCtrl', function($scope, $state, $modal, apiService, user, chronicles, publicchronicles) {
  $scope.publicchronicles = publicchronicles;
  $scope.currenttab = 1;
  $scope.settab = function(chosentab){
    $scope.currenttab = chosentab;
  };
  $scope.istab = function(settab){
    return $scope.currenttab == settab;
  };
  $scope.chronicles = chronicles;
  $scope.user = user;
  $scope.owned = chronicles.filter(function(chronicle){
    return chronicle.user._id == $scope.user._id;
  });
  console.log($scope.owned);
  $scope.readaccess = chronicles.filter(function(chronicle){
    return chronicle.read.indexOf($scope.user._id) !== -1;
  });
  console.log($scope.readaccess);
  $scope.editaccess = chronicles.filter(function(chronicle){
    return chronicle.edit.indexOf($scope.user._id) !== -1;
  });

  $scope.settings = function(chronicle) {
    $scope.chronicle = chronicle;

    var modalInstance = $modal.open({
      templateUrl: 'chronicles/modal.tpl.html',
      scope: $scope,
      controller: function ($scope, $modalInstance) {
        $scope.edit = function () {
          $state.go('app.chronicle.edit', { chronicleId: $scope.chronicle._id });
          $modalInstance.dismiss('cancel');
        }; 

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };

        $scope.delete = function (chronicle) {
          apiService.chronicle($scope.chronicle._id).delete().then(function(){
            $state.go('app.chronicles');
            $modalInstance.dismiss('cancel');
          });
        };
      }
    });
  };
})

.controller('PublicChroniclesCtrl', function($scope, $state, $modal, apiService, user, chronicles){
  $scope.chronicles = chronicles;
  $scope.user = user;
 
  $scope.settings = function(chronicle) {
    $scope.chronicle = chronicle;

    var modalInstance = $modal.open({
      templateUrl: 'chronicles/modal.tpl.html',
      scope: $scope,
      controller: function ($scope, $modalInstance) {
        $scope.edit = function () {
          $state.go('app.chronicle.edit', { chronicleId: $scope.chronicle._id });
          $modalInstance.dismiss('cancel');
        }; 

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };

        $scope.delete = function (chronicle) {
          apiService.chronicle($scope.chronicle._id).delete().then(function(){
            $state.go('app.public');
            $modalInstance.dismiss('cancel');
          });
        };
      }
    });
  };

})

.controller('UserNavCtrl', function($scope, $state, apiService, user, chornicles){
  console.log("ew");
  $scope.$state = $state;
  $scope.user = user;
  $scope.logout = function(){
    console.log($scope.user);
    apiService.logout($scope.user);
    $state.go('app.login');
  };
})
;