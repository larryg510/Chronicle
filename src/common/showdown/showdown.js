//Markdown renderer
//Requires that you use ng-bind-html in template
//<p ng-bind-html="foo | showdown"></p>

angular.module( 'showdown', [] )

.filter('showdown', function() {
  var converter = new Showdown.converter();
  return function(string) {
    return converter.makeHtml(string ? string.replace(/\n/g, "  \n") : '')
                    .replace(/<(a)([^>]+)>/g, '<$1 target="_blank" $2>');
  };
});