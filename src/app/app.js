angular.module('chronicle', [
  'templates-app',
  'templates-common',
  'chronicle.api',
  'chronicle.chronicle',
  'ngSanitize',
  'ui.bootstrap',
  'ui.router',
  'ui.route'
])

.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise( '/' );
  $stateProvider.state('app', {
    url: '/',
    controller: 'AppCtrl',
    templateUrl: 'app.tpl.html',
    resolve: {
      user: ['apiService', function(apiService) {
        return apiService.user().info();
      }]
    },
    data: {
      error: "Something's broken in auth"
    }
  });
})

.run(function($rootScope, $state, apiService) {
  // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
  //   //console.log('stateChangeStart', toState, fromState);
  //   // TODO - rework once ui-router reload is fixed
  //   if (toState.name === 'app' && fromState.name !== '') {
  //     event.preventDefault();
  //     apiService.auth.getUser().then(function(user) {
  //       var state = user ? 'app.home' : 'app.welcome';
  //       $state.go(state, toParams);
  //     });
  //   }
  // });
  // $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
  //   //console.log('stateChangeSuccess', toState, fromState);
  //   if (angular.isObject(toState.data) && angular.isDefined(toState.data.pageTitle)) {
  //     $rootScope.pageTitle = toState.data.pageTitle + ' :: Modit' ;
  //   }
  // });
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.log('stateChangeError', toState, fromState, error);
    event.preventDefault();
    $state.go('app.error', { status: error.status, error: error.data.error });
  });
})

.controller('AppCtrl', function($scope, $state, apiService, user) {
  $state.go('app.chronicle', { chronicleId: '5369238f2df443631a888633' });
})

;