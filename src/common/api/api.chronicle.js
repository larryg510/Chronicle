  angular.module('chronicle.api.chronicle', ['chronicle.api.http', 'chronicle.api.event'])
  .factory('apiChronicle', ['apiHTTP', 'apiEvent',
    function(apiHTTP, apiEvent){
  
      function Chronicle(id){
        this.id = id;
        this.http = new apiHTTP('/api/chronicle/');
      }
      
      Chronicle.prototype = {
        info: function(){
          return this.http.get(this.id);
        },
        events: function(){
          return this.http.get(this.id + '/events');
        },
        event: function(eventId){
          return apiEvent(this.id, eventId);
        },
        newEvent: function(metadata){
          return this.http.post(this.id + '/events', metadata);
        }
      };
      
      return function(id){
        return new Chronicle(id);
      };
    }
  ]);