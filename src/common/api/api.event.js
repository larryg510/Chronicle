  angular.module('chronicle.api.event', ['chronicle.api.http'])
  .factory('apiEvent', ['apiHTTP',
    function(apiHTTP){
      
      function Event(prefix, id){
        this.http = new apiHTTP(prefix + '/event/' + id);
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
        }
      };
      
      return function(prefix, id){
        return new Event(prefix, id);
      };
    }
  ]);