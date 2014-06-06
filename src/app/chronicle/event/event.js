angular.module('chronicle.event', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap',
])

.config(function($stateProvider) {
  var resolve = {
    
  };

  $stateProvider.state('app.chronicle.event', {
    resolve: resolve,
    url: '{eventId:[0-9a-f]{24}}',
    views: {
      main: {
        controller: 'EventCtrl',
        templateUrl: 'chronicle/event/event.tpl.html',
      }
    }
  });
})

.controller('EventCtrl', function($scope, $state, apiService, $modal) {
  $scope.events.forEach(function(event){
    if(event._id == $state.params.eventId) {
      $scope.event = event;
    }
  });
  
  $scope.$root.$broadcast('scroll-to-event', $scope.event);


  $scope.open = function () {

    var _chronicle = $scope.chronicle;
    var _event = $scope.event;

    var modalInstance = $modal.open({
      templateUrl: 'chronicle/event/modal.tpl.html',
      controller: function ($scope, $modalInstance) {
        $scope.tabs = [
          { title:'Text Content', thing:'Comment', format: 'text' },
          { title:'Quote', thing:'Quote', format: 'quote'},
          { title:'Image', thing:'upload image', format: 'image'}
        ];

        $scope.create = function () {
          var format, content;
          $scope.tabs.forEach(function(tab){
            if(tab.active) {
              format = tab.format;
              content = tab.content;
            }
          });

          apiService.chronicle(_chronicle._id).event(_event._id).newContent({
            format: format,
            content: content
          }).then(function(content){
            _event.content.push(content);
          });

          $modalInstance.close();
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      }
    });
  };

});