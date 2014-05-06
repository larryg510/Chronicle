var cluster = require('cluster')
  , os      = require('os')
  , Server  = require('./server')
  , debug   = process.execArgv.join(' ').indexOf('--debug') !== -1;
  
if (cluster.isMaster && !debug) {
  var cpuCount = os.cpus().length;
  for (var i = 0; i < cpuCount; i += 1) {
      cluster.fork();
  }
  
  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died');
    cluster.fork();
  });
} else {
  new Server();
}