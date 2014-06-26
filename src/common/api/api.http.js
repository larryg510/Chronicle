angular.module('chronicle.api.http', [])
  .provider('apiHTTP', function(){

    this.$get = ['$http', '$q', function($http, $q){

      function HTTP(prefix){
        this.prefix = prefix;
      }

      HTTP.prototype = {
        transmit: function(method, action, options, raw){
          var deferred = $q.defer();
          return $http[method](this.prefix + action, options, raw ? {
            withCredentials: true,
            transformResponse: function(data){
              return data;
            }
          }: { withCredentials: true }).then(function(results){
            return results.data;
          });
        },
        post: function (action, data, raw){
          // Post actions require login
          return this.transmit('post', action || '', {
            data: data || {},
            withCredentials: true
          }, raw);
        },
        get: function (action, data, raw){
          return this.transmit('get', action || '', {
            params: data || {},
            withCredentials: true
          }, raw);
        },
        delete: function (action, data, raw){
          return this.transmit('delete', action || '', {
            params: data || {},
            withCredentials: true
          }, raw);
        }
      };

      return HTTP;
    }];
  });
