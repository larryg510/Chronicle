  angular.module('chronicle.api.chronicle', ['chronicle.api.http', 'chronicle.api.event'])
  .factory('apiChronicle', ['apiHTTP', 'apiEvent',
    function(apiHTTP, apiEvent){
  
      function Chronicle(prefix, id){
        this.http = new apiHTTP(prefix + '/chronicle/' + id);
      }
      
      Chronicle.prototype = {
        info: function(){
          return this.http.get();
        },
        events: function(){
          return this.http.get('/events');
        },
        event: function(eventId){
          return apiEvent(this.http.prefix, eventId);
        },
        newEvent: function(metadata){
          return this.http.post('/events', metadata);
        }
      };
      
      return function(prefix, id){
        return new Chronicle(prefix, id);
      };
    }
  ]);