angular.module('chronicle.api.user', ['chronicle.api.http'])
  .factory('apiUser', ['apiHTTP',
    function(apiHTTP){
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
        }
      };
      
      return function(id){
        return new User(id);
      };
    }
  ]);