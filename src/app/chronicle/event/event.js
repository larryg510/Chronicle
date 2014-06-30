angular.module('chronicle.event', [
  'chronicle.event.edit',
  'chronicle.api',
  'ui.router',
  'ui.bootstrap',
  'filereader'
])

.config(function($stateProvider) {
  var resolve = {
    
  };

  $stateProvider.state('app.chronicle.event', {
    resolve: resolve,
    url: '/{eventId:[0-9a-f]{24}}',
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
  /*
   $scope.deleteEvent = function() {
    apiService.chronicle(chronicle._id).event($scope.event._id).deleteEvent($scope.event._id).then(function(){
      var index = $scope.events.indexOf($scope.event);
      if(index !== -1){
        $scope.events.splice(index, 1);
      }
      $state.go($scope.events.length ? 'app.chronicle.events' : 'app.chronicle.newevent');
    });
  };
  */


  $scope.$root.$broadcast('scroll-to-event', $scope.event);


  $scope.open = function (position) {

    var _chronicle = $scope.chronicle;
    var _event = $scope.event;

    var modalInstance = $modal.open({
      templateUrl: 'chronicle/event/modal.tpl.html',
      scope: $scope,
      controller: function ($scope, $modalInstance) {
        $scope.tabs = [
          { title:'Text Content', thing:'Comment', format: 'text', content: '' },
          { title:'Quote', thing:'Quote', format: 'quote', content: ''},
          { title:'Image', thing:'Upload (Must be a file <68 KB large)', format: 'image', content: '' }
        ];

        $scope.getActiveTab = function(){
          for(var i = 0; i < $scope.tabs.length; i++){
            if($scope.tabs[i].active) { return $scope.tabs[i]; }
          }
        };

        $scope.create = function (img) {
          var format, content;
          var activeTab = $scope.getActiveTab();

          apiService.chronicle(_chronicle._id).event(_event._id).newContent({
            format: activeTab.format,
            content: activeTab.content
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
    $scope.deleteContent = function (id) {
    console.log(id.id);
    apiService.chronicle($scope.chronicle._id).event($scope.event._id).deleteContent(id).then(function(){
      for(var i = 0; i < $scope.event.content.length; i++){
        if($scope.event.content[i]._id == id.id){
          var index = i;
          $scope.event.content.splice(index, 1);
        }
      }
    });
  };


});