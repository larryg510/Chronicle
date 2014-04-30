angular.module('chronicle').controller('ContentCtrl', function($scope, chronicle){
    $scope.events = chronicle.content.events;
 
    $scope.createEvent = function() {
		chronicle.content.appendEvent({title: $("#newevent_title").val(), replies: [{content: $("#newevent_details").val()}]});
		$('#newevent').modal('hide');
    };
	
	$scope.reply = function() {
		chronicle.content.reply($("#reply_content").val());
		$('#reply').modal('hide');
    };
    
    setInterval(function(){
        $scope.$apply();
    }, 100);
});