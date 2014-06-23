var express   = require('express')
  , mongoose  = require('mongoose')
  , Chronicle = require('./models/chronicle')
  , User      = require('./models/user')
;

var router          = new express.Router()
  , userRouter      = new express.Router()
  , chronicleRouter = new express.Router();

router.use(function(req, res, next){
  res.success = function(data){
    res.json(data);
  };

  res.error = function(error, code){
    res.json(500 || code, { error: error });
  };

  User.findOneQ({ sessionId: req.sessionID }).then(function(user){
    req.login = user;
  }).then(function(){
    next();
  });
});

router.post('*', function(req, res, next){
  if(!req.login) { return res.error('you must be logged in', 403); }
  next();
});

// get current user's personal profile
router.post('/signup', function(req, res, next){
  if(req.login){
    return res.success(req.login.toObject()); //should never really happen
  } else {
    var user = new User({
      name: req.body.data.username,
      sessionId: req.sessionID
    });

    user.saveQ().thenResolve(user).then(res.success).catch(res.error);
  }
});

// get current user's personal profile
router.get('/chronicles', function(req, res, next){
  Chronicle.findQ({ user: req.login && req.login._id }).then(res.success).catch(res.error);
});

// post new chronicle to user's chronicle library
router.post('/chronicles', function(req, res, next){
  var chronicle =  new Chronicle(req.body.data);
  chronicle.user = req.login._id;
  chronicle.saveQ().thenResolve(chronicle).then(res.success).catch(res.error);
});


//=====Chronicle Routes===========================================================================
// map data to req.chronicle using requested chronicle id
router.param('chronicle', function(req, res, next, id){
  Chronicle.findByIdQ(id).then(function(chronicle){
    req.chronicle = chronicle;
    next();
  });
});

// map data to req.event using requested event id
chronicleRouter.param('event', function(req, res, next, id){
  req.event = req.chronicle.events.id(id);
  next();
});

// get data from requested chronicle
chronicleRouter.get('/', function(req, res, next){
  res.json(req.chronicle);
});

// get all event data from requested chronicle
chronicleRouter.get('/events', function(req, res, next){
  res.json(req.chronicle.events);
});


// push new event to requested chronicle
chronicleRouter.post('/events', function(req, res, next){
  var event = req.chronicle.events[req.chronicle.events.push({ owner: req.user, metadata: req.body.data}) - 1];
  req.chronicle.updateQ({ $push: { 'events': event }}).then(function() {
    res.json(event);
  });
});

// get specific event data from requested chronicle
chronicleRouter.get('/event/:event', function(req, res, next){
  res.json(req.event);
});

// edit metadata from specific event in requested chronicle
chronicleRouter.post('/event/:event', function(req, res, next){
  req.event.metadata = req.body.data;
  Chronicle.findOneAndUpdateQ({ events: { $elemMatch: { _id: req.event._id } } },
    { $set: { 'events.$.metadata': req.event.metadata.toObject() } }).then(function() {
    res.json(req.event);
  });
});

// push new content to event in requested chronicle
chronicleRouter.post('/event/:event/content', function(req, res, next){
  req.body.data.owner = req.user;
  var content = req.event.content[req.event.content.push(req.body.data) - 1];
  Chronicle.findOneAndUpdateQ({ events: { $elemMatch: {_id: req.event._id } } },
    { $push: {'events.$.content' : content.toObject() }}).then(function(){
      content.owner = req.user;
      res.json(content);
     }).catch(console.log);
  //req.chronicle.event.updateQ({ $push: { content: content } }).then(function(){
});


router.use('/chronicle/:chronicle', chronicleRouter);


//===User Routes=========================================================================

// map data to req.user using requested id
userRouter.param('user', function(req, res, next, id) {
  User.findByIdQ(id).then(function(user){
    req.user = user;
    next();
  });
});


// get current user info
userRouter.get('/', function(req, res, next){
  res.success(req.login || 'not logged in');
});

// get requested user's personal profile
userRouter.get('/:user', function(req, res, next){
  res.success(req.user);
});

// get requested user's chronicle library
userRouter.get('/:user/chronicles', function(req, res, next){
  Chronicle.findQ({ user: req.user._id }).then(res.success).catch(res.error);
});

router.use('/user', userRouter);

exports.router = router;