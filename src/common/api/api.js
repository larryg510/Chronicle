angular.module('chronicle.api', ['chronicle.api.user', 'chronicle.api.chronicle'])
  .factory('apiService', ['apiUser', 'apiChronicle', 'apiHTTP',
    function(apiUser, apiChronicle, apiHTTP){
      var http = new apiHTTP('/api/');
      
      return {
        user: apiUser,
        chronicle: apiChronicle,
        newChronicle: function(chronicle){
          return http.post('/chronicles', chronicle);
        },
        signup: function(username){
          return http.post('signup', { username: username });
        }
      };
    }
  ]);