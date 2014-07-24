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
            return this.http.post('/events' + (before ? '?before=' + before : ''), metadata);
          }else {
            return this.http.get('/events');
          }
        },
        event: function(eventId){
          return apiEvent(eventId, this.http.prefix);
        },
        update: function(info){
          return this.http.post('', info);
        },
        delete: function(){
          return this.http.delete('/');
        },
        readaccess: function(addeduser){
          return this.http.post('/read', addeduser);
        },
        editaccess: function(addeduser){
          return this.http.post('/edit', addeduser);
        }
        
      };
      
      return function(id, prefix){
        return new Chronicle(id, prefix);
      };
    }
  ]);