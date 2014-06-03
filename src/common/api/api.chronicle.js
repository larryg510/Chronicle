angular.module('chronicle.api.chronicle', ['chronicle.api.http'])
  .factory('apiChronicle', ['apiHTTP',
    function(apiHTTP){
      var http = new apiHTTP('/api/chronicle/');
      
      function Chronicle(id){
        this.id = id;
      }
      
      Chronicle.prototype = {
        info: function(){
          return http.get(this.id);
        },
        events: function(){
          return http.get(this.id + '/events');
        }
      };
      
      return function(id){
        return new Chronicle(id);
      };
    }
  ]);