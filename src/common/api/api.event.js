  angular.module('chronicle.api.event', ['chronicle.api.http'])
  .factory('apiEvent', ['apiHTTP',
    function(apiHTTP){
      
      function Event(chronicle, id){
        this.http = new apiHTTP('/api/chronicle/' + chronicle + '/event');
        this.id = id;
      }
      
      Event.prototype = {
        info: function(){
          return this.http.get(this.id);
        },
        contents: function(){
          return this.http.get(this.id + '/contents/');
        },
        newContent: function(content){
          return this.http.post(this.id + '/contents', content);
        },
      };
      
      return function(chronicle, id){
        return new Event(chronicle, id);
      };
    }
  ]);