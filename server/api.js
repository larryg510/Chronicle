var express   = require('express')
  , mongoose  = require('mongoose')
  , Chronicle = require('./models/chronicle')
  , User      = require('./models/user')
  , Q         = require('q')
;

var router          = new express.Router()
  , userRouter      = new express.Router()
  , chronicleRouter = new express.Router();

router.use(function(req, res, next){
  // standardizes success
  res.success = function(data){
    res.json(data);
  };

  // standardizes error
  res.error = function(error, code){
    res.json(500 || code, { error: error });
  };

  // login based on user's sessionID
  User.findOneQ({ sessionId: req.sessionID }).then(function(user){
    req.login = user;
  }).then(function(){
    next();
  });
});

// if no sessionID found
router.post('*', function(req, res, next){
  //if(!req.login) { return res.error('you must be logged in', 403); }
  next();
});

// creates sessionID for new user
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

// get current user's chronicles
router.get('/chronicles/owned', function(req, res, next){
  Chronicle.findQ({ user: req.login && req.login._id}).then(res.success).catch(res.error);
});

// get all chronicles
router.get('/chronicles', function(req, res, next){
  //Chronicle.findQ({ user: req.login && req.login._id }).then(res.success).catch(res.error);
  Chronicle.find({}).populate("user").execQ().then(res.success).catch(res.error)
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

// get all info from requested chronicle
chronicleRouter.get('/', function(req, res, next){
  res.json(req.chronicle);
});

// get all events from requested chronicle
chronicleRouter.get('/events', function(req, res, next){
  req.chronicle.populateQ("events.content.owner").then(function(){
    res.json(req.chronicle.events);
  });

});

// edit chronicle title
chronicleRouter.post('/chronicle/:chronicle', function(req, res, next){
  req.chronicle.title = req.body.data;
  Chronicle.findOneAndUpdateQ( { $elemMatch: { _id: req.chronicle._id } },
    { $set: { 'chronicle.$.title': req.chronicle.title.toObject() } }).then(function() {
    res.json(req.chronicle);
  });
});

// push new event to requested chronicle
chronicleRouter.post('/events', function(req, res, next){
  var event = { owner: req.user, metadata: req.body.data };

  console.log(req.query.before);

  if(req.query.before){
    //splice before this id
    var index = req.chronicle.events.length;
    for(var i = 0; i < req.chronicle.events.length; i++){
      if (req.chronicle.events[i]._id == req.query.before){
        index = i; 
        break;
      }
    }
    console.log(index);
    req.chronicle.events.splice(index , 0, event);
    event = req.chronicle.events[index];

    Q.ninvoke(Chronicle.collection, 'update', {_id: req.chronicle._id}, { $push : { 'events' : { $each: [event.toObject()], $position: index } } }).thenResolve(event).then(res.success).catch(res.error);
    // Chronicle.collection.update({_id: req.chronicle._id}, { $push : { 'events' : { $each: [event.toObject()], $position: index } } }, function(error){
    //   console.log(arguments);
    //   if (error) {return res.error(error);} 
    //   else {return res.success(event);}
    // })
    //Chronicle.updateQ({_id: req.chronicle._id}, { $push : { 'events' : { $each: [event.toObject()], $position: index } } }).thenResolve(event).then(res.success).catch(res.error);


  }else {
    req.chronicle.updateQ({ $push: { 'events': event }}).then(function() {
      req.chronicle.events.push({ owner: req.user, metadata: req.body.data});
      res.json(event);
    });
  }

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
  req.body.data.owner = req.login;
  if(req.query.id){
    var content = req.body.data;
    var index = req.event.content.length;
    for(var i = 0; i < req.event.content.length; i++){
      if (req.event.content[i]._id == req.query.id){
        index = i;
        break;
      }
    }
    console.log(index);
    //must define content before running code
    console.log(req.event);
    req.event.content.splice(index, 0, content);
    content = req.event.content[index].toObject();

    console.log(content);
    Q.ninvoke(Chronicle.collection, 'update', {events: {$elemMatch: {_id: req.event._id} } },
      { $push: {'events.$.content' : { $each: [content], $position: index} } }).then(function(){
        var response = content;
        response.owner = req.login.toObject();
        res.json(response);
      }).then(res.success).catch(res.error);
  }
  else{
  
  var content = req.event.content[req.event.content.push(req.body.data) - 1];
  Chronicle.findOneAndUpdateQ({ events: { $elemMatch: {_id: req.event._id } } },
    { $push: {'events.$.content' : content.toObject() }}).then(function(){
      var response = content.toObject();
      response.owner = req.login.toObject();
      res.json(response);
     }).catch(console.log);
  //req.chronicle.event.updateQ({ $push: { content: content } }).then(function(){
  }
});

chronicleRouter.delete('/event/:event/content', function(req, res, next){
  console.log("Nyabu");
  console.log(req.query.id);
  Chronicle.findOneAndUpdateQ({events: {$elemMatch: {_id: req.event._id} } }, 
    { $pull: { 'events.$.content': { _id: req.query.id } } }).then(res.success).catch(res.error)
});

//delete a chronicle 
chronicleRouter.delete('/', function(req, res, next){
  console.log("omgmiew");
  Chronicle.findByIdAndRemoveQ(req.chronicle._id).then(res.success).catch(res.error);
});

//delete an event 
chronicleRouter.delete('/event/:event', function(req, res, next){
  console.log("delete event");  
  Chronicle.findByIdAndUpdateQ(req.chronicle._id,
    { $pull: { 'events': { _id: req.event._id } } }).then(res.success).catch(res.error);
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