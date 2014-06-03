angular.module('chronicle.api', ['chronicle.api.user', 'chronicle.api.chronicle'])
  .factory('apiService', ['apiUser', 'apiChronicle',
    function(apiUser, apiChronicle){
      return {
        user: apiUser,
        chronicle: apiChronicle
      };
    }
  ]);