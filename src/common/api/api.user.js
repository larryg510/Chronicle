angular.module('chronicle.api.user', ['chronicle.api.http','chronicle.api.chronicle'])
  .factory('apiUser', ['apiHTTP', 'apiChronicle',
    function(apiHTTP, apiChronicle){
      function User(id){
        this.http = new apiHTTP('/api/user/' + (id || ''));
      }
      
      User.prototype = {
        info: function(){
          return this.http.get();
        },
        chronicles: function(){
          return this.http.get('/chronicles');
        },
        chronicle: function(chronicleId){
          return apiChronicle(chronicleId, this.http.prefix);
        }

      };
      
      return function(id){
        return new User(id);
      };
    }
  ]);