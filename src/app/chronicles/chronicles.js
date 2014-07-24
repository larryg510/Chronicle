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
        controller: 'ChronicleTopNavCtrl',
        templateUrl: 'chronicle/chronicle-nav.tpl.html',
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
      }, 
      topnav: {
        controller: 'ChronicleTopNavCtrl',
        templateUrl: 'chronicle/chronicle-nav.tpl.html',
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
        controller: 'ChronicleTopNavCtrl',
        templateUrl: 'chronicle/chronicle-nav.tpl.html',
      }
    },
    resolve: {
      chronicles: function($stateParams, apiService){
        return apiService.public();
      }
    }
  });
})

.controller('ChroniclesCtrl', function($scope, $state, $modal, apiService, user, chronicles) {
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

  $scope.readaccess = chronicles.filter(function(chronicle){
    return chronicle.read.indexOf($scope.user._id) !== -1;
  });
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

.controller('ChronicleTopNavCtrl', function($scope, $state, apiService, user, chronicles) {
  $scope.$state = $state;
  $scope.user = user;
  $scope.logout = function(){
    apiService.logout($scope.user);
    $state.go('app.login');
  };

  $scope.$on('scroll-to-event', function(e, event){
    $scope.event = event;
  });
})

.controller('UserNavCtrl', function($scope, $state){
})
;