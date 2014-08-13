angular.module('chronicle.api', ['chronicle.api.user', 'chronicle.api.chronicle'])
  .factory('apiService', ['apiUser', 'apiChronicle', 'apiHTTP',
    function(apiUser, apiChronicle, apiHTTP){
      var http = new apiHTTP('/api/');
      
      return {
        user: apiUser,
        chronicle: apiChronicle,
        chronicles: function(chronicle){
          if(chronicle){
            return http.post('chronicles', chronicle);
          }else {
            return http.get('chronicles');
          }
          
        },
        users: function(search){
          return http.get('users', { search: search });
        },
        signup: function(account){
          return http.post('signup', account);
        },
        login: function(account){
          return http.post('login', account);
        },
        public: function(){
          return http.get('public');
        },
        updates : function(){
          return http.get('updates');
        },
        logout : function(user) {
          return http.post('logout', user);
        },
        profilechronicles: function(userId){
          return http.get('profilechronicles', userId);
        },
        edituser : function(user) {
          return http.post('edituser', user);
        },
        editprofile: function(user) {
          return http.post('editprofile', user);
        },
        editpass: function(pass) {
          return http.post('editpass', pass);
        },
        retrieveusers: function(){
          return http.get('retrieveusers');
        },
        follow: function(user){
          return http.post('follow', user);
        },
        unfollow: function(user){
          return http.post('unfollow', user);
        },
        followingchronicles: function(){
          return http.get('followingchronicles');
        },
        isfollowing: function(profile){
          return http.get('isfollowing', profile);
        }
        // mychronicles: function(){
        //   return http.get('/chronicles/owned');
        // }
      };
    }
  ]);