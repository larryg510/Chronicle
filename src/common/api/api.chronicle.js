  angular.module('chronicle.api.chronicle', ['chronicle.api.http', 'chronicle.api.event'])
  .factory('apiChronicle', ['apiHTTP', 'apiEvent',
    function(apiHTTP, apiEvent){
  
      function Chronicle(id, prefix){
        this.http = new apiHTTP((prefix || '/api') + '/chronicle/' + id);
      }
      
      Chronicle.prototype = {
        info: function(){
          return this.http.get();
        },
        events: function(metadata, before){
          if(metadata){
            console.log(before);
            return this.http.post('/events' + (before ? '?before=' + before : ''), metadata);
          }else {
            return this.http.get('/events');
          }
        },
        event: function(eventId){
          return apiEvent(eventId, this.http.prefix);
        },
        delete: function(){
          return this.http.delete('/');
        }
      };
      
      return function(id, prefix){
        return new Chronicle(id, prefix);
      };
    }
  ]);