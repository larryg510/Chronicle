angular.module('chronicle.api', ['chronicle.api.user', 'chronicle.api.chronicle'])
  .factory('apiService', ['apiUser', 'apiChronicle', 'apiHTTP',
    function(apiUser, apiChronicle, apiHTTP){
      var http = new apiHTTP('/api/');
      
      return {
        user: apiUser,
        chronicle: apiChronicle,
        chronicles: function(chronicle){
          if(chronicle){
            return http.post('/chronicles', chronicle);
          }else {
            return http.get('/chronicles');
          }
          
        },
        signup: function(username){
          return http.post('signup', { username: username });
        },
        mychronicles: function(){
          return http.get('/chronicles/owned');
        }
      };
    }
  ]);