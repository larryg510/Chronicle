  angular.module('chronicle.api.event', ['chronicle.api.http'])
  .factory('apiEvent', ['apiHTTP',
    function(apiHTTP){
      
      function Event(id, prefix){
        this.http = new apiHTTP((prefix || '/api') + '/event/' + id);
      }
      
      Event.prototype = {
        info: function(){
          return this.http.get();
        },
        newContent: function(content){
          return this.http.post('/content', content);
        },
        update: function(metadata){
          return this.http.post('', metadata);
        },
        deleteEvent: function(){
          return this.http.delete('');
        },
        deleteContent: function(id){
          return this.http.delete('/content', id);
        }
      };
      
      return function(id, prefix){
        return new Event(id, prefix);
      };
    }
  ]);