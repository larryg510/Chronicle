/*
    Chronicle
*/

angular.module('chronicle', [])
.factory('chronicle', function(){
    var chronicle = {
        create : function(){
            //
        },
		content : {
            _priv : {
                _events : []
            },
            get events(){
                return this._priv._events;
            },
            appendEvent : function(eventsObj){
                chronicle.content._priv._events.push(eventsObj);
            },
			reply : function(content){
				chronicle.content._priv._events[0].replies.push({content: content});
			}
        }
    };
    
    chronicle.create();
    
    return chronicle;
});