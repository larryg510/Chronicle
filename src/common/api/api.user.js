angular.module('chronicle.api.user', ['chronicle.api.http','chronicle.api.chronicle'])
  .factory('apiUser', ['apiHTTP', 'apiChronicle',
    function(apiHTTP, apiChronicle){
      var http = new apiHTTP('/api/user/');
      
      function User(id){
        this.id = id;
      }
      
      User.prototype = {
        info: function(){
          return http.get(this.id);
        },
        chronicles: function(){
          return http.get(this.id + '/chronicles');
        },
        newChronicle: function(chronicle){
          return http.post(this.id + '/chronicles', chronicle);
        }

      };
      
      return function(id){
        return new User(id);
      };
    }
  ]);