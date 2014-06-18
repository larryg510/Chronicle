angular.module('filereader', [])
  .directive("filereader", [
    function() {
      return {
        scope: {
          filereader: "="
        },
        link: function(scope, element, attributes) {
          element.bind("change", function(changeEvent) {
            var reader = new FileReader();
            reader.onload = function(loadEvent) {
              scope.$apply(function() {
                scope.filereader = loadEvent.target.result;
              });
            };
            reader.readAsDataURL(changeEvent.target.files[0]);
          });
        }
      };
    }
  ]);

