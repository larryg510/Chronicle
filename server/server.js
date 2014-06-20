var express         = require('express')
  , bodyParser      = require('body-parser')
  , cookieParser    = require('cookie-parser')
  , expressSession  = require('express-session')
  , app             = express()
  , Path            = require('path')
  , mongoose        = require('mongoose-q')(require('mongoose'), { spread:true })
  , MongoStore      = require('connect-mongo')(expressSession)
  , api             = require('./api')
  , ejs             = require('ejs'); ejs.open = '<$'; ejs.close = '$>'
;

//===Temporary Fig testing==============================================
process.env.MONGO_PORT_27017_TCP_ADDR = process.env.MONGO_PORT_27017_TCP_ADDR || process.env.MONGO_1_PORT_27017_TCP_ADDR;
process.env.MONGO_PORT_27017_TCP_PORT = process.env.MONGO_PORT_27017_TCP_PORT || process.env.MONGO_1_PORT_27017_TCP_PORT;


function Server(){
  var server, db;
  
  //===Database Connection================================================
  var connString = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT
                + '/' + process.env.MONGO_DATABASE;
                
  mongoose.connect(connString);
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('MongoDB Connection Opened');
    
    var sessionStore = new MongoStore({
      host: process.env.MONGO_PORT_27017_TCP_ADDR,
      port: process.env.MONGO_PORT_27017_TCP_PORT,
      db: process.env.MONGO_DATABASE,
      auto_reconnect: true
    });
    
    //===Web Server=========================================================================
  
    app.set('port',  process.env.WEB_PORT || 80);
    app.set('views', Path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb' }));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(expressSession({
      secret: process.env.COOKIE_SECRET,
      maxAge: new Date(Date.now() + parseInt(process.env.COOKIE_MAX, 10)),
      store: sessionStore
    }));
    app.use(express.static(Path.resolve(__dirname, '../build')));
    
    //---Api Route--------------------------------------------------------------------------
    app.use('/api', api.router);
    
    //---Main Route--------------------------------------------------------------------------
    app.use(function(req, res, next) {
      res.render(Path.resolve(__dirname, '../build/index.ejs'));
    });
    
    server = app.listen(process.env.WEB_PORT || 80, function() {
      console.log('Listening on port %d', server.address().port);
    });
  });
  


  //===Graceful Shutdown===============================================================
  // this function is called when you want the server to die gracefully
  // i.e. wait for existing connections
  function gracefulShutdown() {
    console.log('Received kill signal, shutting down gracefully.');
    server.close(function() {
      console.log('Express closed out remaining connections.');
      db.close(function(){
        console.log('MongoDB closed out remaining connections.');
        process.exit();
      });
    });
    
    // if after
    setTimeout(function() {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit();
    }, 3*1000);
  }
  
  // listen for TERM signal .e.g. kill
  process.on('SIGTERM', gracefulShutdown);
  
  // listen for INT signal e.g. Ctrl-C
  process.on('SIGINT', gracefulShutdown);
  
  process.on('uncaughtException', function (error) {
    console.error('An uncaughtException was found, this process will end.', error);
    gracefulShutdown();
  });
}

module.exports = Server;