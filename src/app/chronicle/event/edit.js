angular.module('chronicle.event.edit', [
  'chronicle.api',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider) {
  $stateProvider.state('app.chronicle.event.edit', {
    url: '/edit',
    views: {
      'main@app.chronicle': {
        controller: 'EditEventCtrl',
        templateUrl: 'chronicle/event/edit.tpl.html',
      }
    }
  });

  $stateProvider.state('app.chronicle.neweventyay', {
    url: '/newevent/:currentEvent',
    views: {
      main: {
        controller: 'EditEventCtrl',
        templateUrl: 'chronicle/event/edit.tpl.html',
      }
    }
  });

  $stateProvider.state('app.chronicle.newevent', {
    url: '/newevent',
    views: {
      main: {
        controller: 'EditEventCtrl',
        templateUrl: 'chronicle/event/edit.tpl.html',
      }
    }
  }); 
})
/*
.controller('DateCtrl', function(){
  this.current = 1;
  this.setcurrent = function(dateoption){
    this.current = dateoption;
  }
  this.isSet = function(dateop){
    return this.current === dateop;
  }

})
*/

.controller('EditEventCtrl', function($scope, $state, apiService, user) {
  if($state.params.eventId){
    //todo search for event in chronicle VVVV ????? 
    /* for(var i = 0; i < $scope.chronicle.events.length; i++){
      if($scope.chronicle.events[i]._id === $state.params.eventId) {
        $scope.metadata = $scope.chronicle.events[i].metadata; 
      }
    }*/
    $scope.events.forEach(function(event){
      if(event._id == $state.params.eventId) {
        $scope.event = event;
      }
    });
  } else {
    $scope.$root.$broadcast('scroll-to-event', { title: 'New Event' });
    $scope.event = {};
  }
  $scope.user = user;
  $scope.editaccess = ($scope.user._id == $scope.chronicle.user) || ($scope.chronicle.edit.indexOf($scope.user._id) !== -1);
  $scope.readaccess = ($scope.chronicle.read.indexOf($scope.user._id) != -1);
  if($scope.event._id || $state.params.currentEvent){
    if(!$scope.editaccess)
    {
      if(!$scope.chronicle.public)
      {
        if($scope.readaccess){
          $state.go('app.chronicle.events');
        }
        else{
          $state.go('app.chronicles');
        }
      }
      else{
        $state.go('app.chronicle.events');
      }
    }
  }
  else{
    if(!$scope.editaccess)
    {
      if(!$scope.chronicle.public)
      {
        if($scope.readaccess){
          $state.go('app.chronicle.events');
        }
        else{
          $state.go('app.chronicles');
        }
      }
      else{
        $state.go('app.chronicle.events');
      }
    }
  }
  $scope.currenttab = 1;
  $scope.settab = function(chosentab){
    $scope.currenttab = chosentab;
  };
  $scope.istab = function(settab){
    return $scope.currenttab == settab;
  };
  $scope.modify = function(){
    $scope.loading = true;
    // Sent to apiService

    if($scope.event._id){
      return apiService.chronicle($scope.chronicle._id).event($scope.event._id).update($scope.event.metadata).then(function(){
        //Add Putting UserID of dude into UpdateID and Add Date into UpdateDate
        //apiService.chronicle($scope.chronicle._id).event($scope.event._id).trackupdates(1).then(function(){});
        $state.go('^');
        $scope.$root.$broadcast('scroll-to-event', event);
      });
    }else if($state.params.currentEvent){
      return apiService.chronicle($scope.chronicle._id).events($scope.event.metadata, $state.params.currentEvent).then(function(event){
        console.log("current event:");
        console.log($state.params.currentEvent);
        var index = 0;
        for (var i = 0; i < $scope.events.length; i ++){
          if ($scope.events[i]._id == $state.params.currentEvent){index = i; console.log("found");}
        }
        $scope.events.splice(index, 0, event);
        //apiService.chronicle($scope.chronicle._id).event($scope.event._id).trackupdates(2).then(function(){});
        $state.go('^.events');
        $scope.$root.$broadcast('scroll-to-event', event);
      });
    }else{
      return apiService.chronicle($scope.chronicle._id).events($scope.event.metadata).then(function(event){
        $scope.events.push(event);
        //apiService.chronicle($scope.chronicle._id).event($scope.event._id).trackupdates(2).then(function(){});
        $state.go('^.events');
        $scope.$root.$broadcast('scroll-to-event', event);
      });
    }
  };
})
;
