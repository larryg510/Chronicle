angular.module('chronicle.event', [
  'chronicle.event.edit',
  'chronicle.api',
  'ui.router',
  'ui.bootstrap',
  'filereader'
])

.config(function($stateProvider) {
  var resolve = {};

  $stateProvider.state('app.chronicle.event', {
    resolve: resolve,
    url: '/{eventId:[0-9a-f]{24}}',
    views: {
      main: {
        controller: 'EventCtrl',
        templateUrl: 'chronicle/event/event.tpl.html',
      },
      bottomnav: {
        controller: 'BottomNavCtrl',
        templateUrl: 'chronicle/event/bottom-nav.tpl.html',
      }
    }
  });

})

.controller('EventCtrl', function($scope, $state, apiService, $modal, user) {
  console.log($scope.events);
  $scope.user = user;
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
  $scope.access = (($scope.user._id == $scope.chronicle.user) || ($scope.chronicle.edit.indexOf($scope.user._id) !== -1) || ($scope.chronicle.read.indexOf($scope.user._id) !== -1));
  if(!($scope.chronicle.public || $scope.access))
  {
    $state.go('app.chronicles');
  }
  $scope.open = function (id) {
    var _chronicle = $scope.chronicle;
    var _event = $scope.event;

    var modalInstance = $modal.open({
      templateUrl: 'chronicle/event/modal.tpl.html',
      scope: $scope,
      controller: function ($scope, $modalInstance) {
        $scope.tabs = [
          { title:'Text Content', thing:'Comment', format: 'text', content: '' },
          { title:'Quote', thing:'Quote', format: 'quote', content: ''},
          { title:'Image', thing:'Upload', format: 'image', content: '' }
        ];

        $scope.getActiveTab = function(){
          for(var i = 0; i < $scope.tabs.length; i++){
            if($scope.tabs[i].active) { return $scope.tabs[i]; }
          }
        };

        $scope.create = function (img) {
         // var format, content;
          var activeTab = $scope.getActiveTab();

        if(id){
          apiService.chronicle(_chronicle._id).event(_event._id).newContent({
            format: activeTab.format,
            content: activeTab.content,
            speaker: activeTab.speaker
          }, id.id).then(function(content){
            //apiService.chronicle(_chronicle._id).event(_event._id).trackupdates({format: activeTab.format, content: activeTab.content}).then(function(){});
            for(var i = 0; i < _event.content.length; i++){
              if(_event.content[i]._id == id.id){
                var index = i;
                _event.content.splice(index, 0, content);
                break;
              }
            }
            
          });
        } 
        else{
          apiService.chronicle(_chronicle._id).event(_event._id).newContent({
            format: activeTab.format,
            content: activeTab.content,
            speaker: activeTab.speaker
          }).then(function(content){
            //apiService.chronicle(_chronicle._id).event(_event._id).trackupdates({format: activeTab.format, content: activeTab.content}).then(function(){});
            _event.content.push(content);
          });
        }
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
    for(var i = 0; i < $scope.event.content.length; i++){
      if($scope.event.content[i]._id == id.id)
      {
        if($scope.event.content[i].owner._id == $scope.user._id)
        {
          var index = i;
          $scope.event.content.splice(index, 1);
          apiService.chronicle($scope.chronicle._id).event($scope.event._id).deleteContent(id).then();
        }
      }
    }
    /*
    apiService.chronicle($scope.chronicle._id).event($scope.event._id).deleteContent(id).then(function(){
      for(var i = 0; i < $scope.event.content.length; i++){
        if($scope.event.content[i]._id == id.id){
          var index = i;
          $scope.event.content.splice(index, 1);
        }
      }
    });
    */
  };


})

.controller('BottomNavCtrl', function($scope, $state, $filter, apiService, chronicle, events) {
  var orderBy = $filter('orderBy');
  $scope.chronicle = chronicle;
  $scope.events = events;
  console.log($scope.events);
  $scope.$state = $state;
  $scope.sortedevents = orderBy($scope.events, ['metadata.date','metadata.time']);
  console.log($scope.sortedevents);

  $scope.sortedevents.forEach(function(event){
    if(event._id == $state.params.eventId) {
      $scope.event = event;
    }
  });

  $scope.currentindex = $scope.sortedevents.indexOf($scope.event);

  if ($scope.currentindex !== 0) {
    $scope.prevevent = $scope.sortedevents[$scope.currentindex - 1];
  }
  else {
    $scope.first = true;
  }

  if ($scope.sortedevents[$scope.currentindex + 1] !== undefined) {
    $scope.nextevent = $scope.sortedevents[$scope.currentindex + 1];
  }
  else {
    $scope.last = true;
  }

});