var express     = require('express')
  , app         = express()
  , Path        = require('path');
  
app.use(express.static(Path.resolve(__dirname, 'public')));

var server = app.listen(process.env.WEB_PORT || 80, function() {
  console.log('Listening on port %d', server.address().port);
});