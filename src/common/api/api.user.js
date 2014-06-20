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
        newChronicle: function(chronicle){
          return this.http.post('/chronicles', chronicle);
        },
        chronicle: function(chronicleId){
          return apiChronicle(this.http.prefix, chronicleId);
        }

      };
      
      return function(id){
        return new User(id);
      };
    }
  ]);