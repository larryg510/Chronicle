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
      }
    }
  });

  $stateProvider.state('app.public', {
    url: 'public',
    views: {
      main: {
        controller: 'PublicChroniclesCtrl',
        templateUrl: 'chronicles/chronicles.tpl.html'
      }
    },
    resolve: {
      chronicles: function($stateParams, apiService){
        return apiService.public();
      }
    }
  });
})

.controller('ChroniclesCtrl', function($scope, $state, apiService, user, chronicles) {
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
  
})

.controller('PublicChroniclesCtrl', function($scope, $state, apiService, user, chronicles){
  $scope.chronicles = chronicles;
  $scope.user = user;

  $scope.test = function() {
    console.log('THIS WORKS');
  };

  $scope.edit = function(chronicle) {
    $state.go('app.chronicle.edit', { chronicleId: chronicle._id });
  };

  $scope.delete = function(chronicle) {
    console.log(chronicle);
  };
})

.controller('UserNavCtrl', function($scope, $state){
  $scope.$state = $state;
})
;