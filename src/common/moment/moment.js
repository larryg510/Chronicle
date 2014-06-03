//General filter for moment.js from now functionality
angular.module('moment', [])

.filter('fromNow', function() {
  return function(dateString) {
    return moment(dateString).fromNow();
  };
})

;