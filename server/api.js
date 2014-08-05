var express   = require('express')
  , mongoose  = require('mongoose')
  , Chronicle = require('./models/chronicle')
  , User      = require('./models/user')
  , Update    = require('./models/updates')
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
    res.json(500 || code, { error: error.message || error });
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
    console.log("hi");
    return res.success(req.login.toObject()); //should never really happen
  } else {
    console.log("miew");
    var user = new User({
      name: req.body.data.name,
      username: req.body.data.username,
      password: req.body.data.password,
      email: req.body.data.email,
      sessionId: req.sessionID
    });

    user.saveQ().thenResolve(user).then(res.success).catch(res.error);
  }
});

//login a user
router.post('/login', function(req, res, next){
  if(req.login){
    return res.success(req.login.toOBject()); //pls why is this happening
  } else {
    User.findOneAndUpdateQ({'username' : req.body.data.username, 'password': req.body.data.password},
      {$set: {'sessionId': req.sessionID}}).then(res.success).catch(res.error);
  }
});


router.post('/edituser', function(req, res, next){
  //FIX THIS var d = new Date();
  console.log(req.body.data);
  // var update = new Update({
  //   user : req.login._id,
  //   chronicle : req.chronicle._id,
  //   event : req.event._id,
  //   obj : req.event,
  //   object : 'obj',
  //   actor : 'user',
  //   verb : 'edit',
  //   target : 'event',
  //   date : d
  // });
  User.findOneAndUpdateQ({ _id : req.body.data._id},
    { $set: { 'name': req.body.data.name } }).then(res.success).catch(res.error);
});

router.post('/editprofile', function(req,res, next){
  console.log(req.body.data);
  User.findOneAndUpdateQ({ _id : req.body.data._id},
    { $set: { 'info' : req.body.data.info} }).then(res.success).catch(res.error);
});
// get current user's chronicles
// router.get('/chronicles/owned', function(req, res, next){
//   Chronicle.find({ user: req.login && req.login._id}).populate("user").execQ().then(res.success).catch(res.error);
// });

// router.get('/chronicles/shared', function(req, res, next){
//   Chronicle.find({ _id: { $in: req.login.read } }).populate('user').execQ().then(function(read){
//     return Chronicle.find({ _id: { $in: req.login.edit } }).populate('user').execQ().then(function(edit){
//       return {
//         read: read,
//         edit: edit
//       }
//     })
//   }).then(res.success).catch(res.error);
//   console.log("omgmiew");

// });

// get all chronicles
router.get('/chronicles', function(req, res, next){
  if(!req.login) { 
    res.error({}, 403); 
  }
  else{
    var query = { $or: [{ user: req.login._id }, { read: req.login._id }, { edit: req.login._id }] };
    Chronicle.find(query).populate("user").execQ().then(res.success).catch(res.error);
  }

});

// post new chronicle to user's chronicle library
router.post('/chronicles', function(req, res, next){
  var chronicle =  new Chronicle(req.body.data);
  chronicle.user = req.login._id;
  var d = new Date();
  var update = new Update({
    user : req.login._id,
    chronicle : chronicle._id,
    obj : chronicle,
    object : 'obj',
    verb : 'add',
    actor : 'user',
    target : 'chronicle',
    date : d
  });
  chronicle.saveQ().thenResolve(chronicle).then(res.success).catch(res.error);
});

//get all users for typeahead
router.get('/users', function(req, res, next){
  console.log('search', req.query.search);
  var query = req.query.search ? { name: { $regex: new RegExp('.*' +  req.query.search  + '.*', 'i') } } : {};
  User.find(query).limit(50).select("name _id").lean().execQ().then(res.success).catch(res.error);
});

//log out of a thing. 
router.post('/logout', function(req, res, next){
  User.findOneAndUpdateQ({_id: req.login._id}, {$set :{sessionId:""}}).then(res.success).catch(res.error);
});

//get all public chronicles
router.get('/public', function(req, res, next){
  Chronicle.find({public : true}).populate("user").execQ().then(res.success).catch(res.error);
});

//get all chronicles for profile
router.get('/profilechronicles', function(req, res, next){
  console.log("Hi");
  console.log(req.query.userId);
  Chronicle.findQ({$and: [{user: req.query.userId}, {public: true}]}).then(res.success).catch(res.error);
});

//get all updaates
router.get('/updates', function(req, res, next){
  console.log('updates');
   Chronicle.find({ $or: [{ read: req.login._id }, { edit: req.login._id }, {user : req.login._id}] }).select('_id').lean().execQ().then(function(chronicles){
    return Update.find({ chronicle: { $in: chronicles } }).populate("user chronicle").execQ();
  }).then(res.success).catch(res.error);
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
chronicleRouter.post('/', function(req, res, next){
  // NOT SURE IF IT WORKS 
  var d = new Date();
  var update = new Update({
    user : req.login._id,
    chronicle : req.chronicle._id,
    obj : {old : req.chronicle.title, new : req.body.data},
    object : 'obj',
    verb : 'edit',
    actor : 'user',
    target : 'chronicle',
    date : d
  });
  req.chronicle.title = req.body.data.title;
  req.chronicle.public = req.body.data.public;
  req.chronicle.photo = req.body.data.photo;
  Chronicle.findOneAndUpdateQ( { _id: req.chronicle._id } ,
    { $set: { 'title': req.chronicle.title, 'public' : req.chronicle.public, 'photo' : req.chronicle.photo } }).then(update.saveQ()).then(res.success).catch(res.error);

});


// push new event to requested chronicle
chronicleRouter.post('/events', function(req, res, next){
  var event = { metadata: req.body.data };  console.log(req.query.before);
  var d = new Date();

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
    var update = new Update({
      user: req.login._id,
      chronicle: req.chronicle._id,
      event: event._id,
      obj: event,
      object : 'obj',
      verb : 'add',
      actor : 'user',
      target : 'event',
      date : d
    });

    Q.ninvoke(Chronicle.collection, 'update', {_id: req.chronicle._id}, { $push : { 'events' : { $each: [event.toObject()], $position: index } } }).then(update.saveQ()).thenResolve(event).then(res.success).catch(res.error);


    //User.updateQ({_id: {$in: users}}, {$push: {'updates': {chronicle: req.chronicle._id, user: req.login.name, event: req.event._id, eventedit: true}}}, {multi: true}).
    // Chronicle.collection.update({_id: req.chronicle._id}, { $push : { 'events' : { $each: [event.toObject()], $position: index } } }, function(error){
    //   console.log(arguments);
    //   if (error) {return res.error(error);} 
    //   else {return res.success(event);}
    // })
    //Chronicle.updateQ({_id: req.chronicle._id}, { $push : { 'events' : { $each: [event.toObject()], $position: index } } }).thenResolve(event).then(res.success).catch(res.error);


  }else {
    var index = req.chronicle.events.length;
    req.chronicle.events.push({metadata: req.body.data});
    event = req.chronicle.events[index];
    console.log(event);
    var update = new Update({
      user : req.login._id,
      chronicle : req.chronicle._id,
      event : event._id,
      obj : event,
      object : 'obj',
      verb : 'add',
      actor : 'user',
      target : 'event',
      date : d
    });
    req.chronicle.updateQ({ $push: { 'events': event}}).then(function() {
      res.json(event);
    }).then(update.saveQ());
  }

});

// get specific event data from requested chronicle
chronicleRouter.get('/event/:event', function(req, res, next){
  res.json(req.event);
});

// edit metadata from specific event in requested chronicle
chronicleRouter.post('/event/:event', function(req, res, next){
  var d = new Date();
  req.event.metadata = req.body.data;
  var update = new Update({
    user : req.login._id,
    chronicle : req.chronicle._id,
    event : req.event._id,
    obj : req.event,
    object : 'obj',
    actor : 'user',
    verb : 'edit',
    target : 'event',
    date : d
  });
  Chronicle.findOneAndUpdateQ({ events: { $elemMatch: { _id: req.event._id } } },
    { $set: { 'events.$.metadata': req.event.metadata.toObject() } }).then(update.saveQ()).then(function() {
    res.json(req.event);
  });
});

// push new content to event in requested chronicle
chronicleRouter.post('/event/:event/content', function(req, res, next){
  req.body.data.owner = req.login;
  var d = new Date();
  //if content is added elsewhere other than at the end
  if(req.query.id){
    var content = req.body.data;
    var index = req.event.content.length;
    for(var i = 0; i < req.event.content.length; i++){
      if (req.event.content[i]._id == req.query.id){
        index = i;
        break;
      }
    }
    //must define content before running code
    req.event.content.splice(index, 0, content);
    content = req.event.content[index].toObject();
    var update = new Update({
      user: req.login._id,
      chronicle: req.chronicle._id, 
      event: req.event._id,
      obj: {content: req.body.data.content, format: req.body.data.format, title: req.event.metadata.title},
      object: 'obj',
      verb: 'addcontent',
      actor: 'user',
      target: 'event',
      date : d
    });
    console.log(update);
    Q.ninvoke(Chronicle.collection, 'update', {events: {$elemMatch: {_id: req.event._id} } },
      { $push: {'events.$.content' : { $each: [content], $position: index} } }).then(function(){
        var response = content;
        response.owner = req.login.toObject();
        res.json(response);
      }).then(update.saveQ()).catch(console.log);
  }
  else{
  
  var content = req.event.content[req.event.content.push(req.body.data) - 1];
  var update = new Update({
    user: req.login._id,
    chronicle: req.chronicle._id,
    event: req.event._id,
    obj: {content: req.body.data.content, format: req.body.data.format, title: req.event.metadata.title},
    object: 'obj',
    verb: 'addcontent',
    actor: 'user',
    target: 'event',
    date : d
  });
  Chronicle.findOneAndUpdateQ({ events: { $elemMatch: {_id: req.event._id } } },
    { $push: {'events.$.content' : content.toObject() }}).then(function(){
      var response = content.toObject();
      response.owner = req.login.toObject();
      res.json(response);
     }).then(update.saveQ()).catch(console.log);

  //req.chronicle.event.updateQ({ $push: { content: content } }).then(function(){
  
  }
});

//delete content
chronicleRouter.delete('/event/:event/content', function(req, res, next){
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
  var d = new Date();
  var update = new Update({
    user : req.login._id,
    chronicle : req.chronicle._id,
    event : req.event._id,
    obj : req.event,
    object : 'obj',
    target  : 'event',
    actor : 'user',
    verb : 'delete',
    date : d
  });
  Chronicle.findByIdAndUpdateQ(req.chronicle._id,
    { $pull: { 'events': { _id: req.event._id } } }).then(res.success).catch(res.error);
});

//add user to read array
chronicleRouter.post('/read', function(req, res, next){
  console.log(req.body.data._id);
  console.log(req.chronicle._id);
  Chronicle.findByIdAndUpdateQ(req.chronicle._id,
    {$addToSet: {'read': req.body.data._id} }).then(res.success).catch(res.error);
  /*
  User.findbyIdAndUpdateQ(req.body.data,
    { $push: { 'chronicles': { _id: req.chronicle._id } } }).then(res.success).catch(res.error);
*/
});

//add user to edit array
chronicleRouter.post('/edit', function(req, res, next){
  console. log(req.body.data);
  Chronicle.findByIdAndUpdateQ(req.chronicle._id,
    {$addToSet: {'edit': req.body.data._id } }).then(res.success).catch(res.error);
});


/*
***************************** DON"T NEED THIS ANYMORE *************************************

//update array within User for notifications
chronicleRouter.post('/trackupdates', function(req, res, next){
  console.log("WEH");
  console.log(req.body.data);
  console.log(req.chronicle._id);
  var users = req.chronicle.read.concat(req.chronicle.edit).concat(req.chronicle.user);
  console.log(users);
  User.updateQ({_id: {$in: users}},
    {$push: {'updates': {chronicle: req.chronicle._id, user: req.login.name} }
    },
    {multi: true}
  ).then(res.success).catch(console.log);
  // for reference
  // var query = { $or: [{ user: req.login._id }, { read: req.login.id }, { edit: req.login._id }] };
  // Chronicle.find(query).populate("user").execQ().then(res.success).catch(res.error);
});

chronicleRouter.post('/event/:event/trackupdates', function(req, res, next){
  console.log("Rawr");
  console.log(req.body.data);
  console.log(req.event);
  var users = req.chronicle.read.concat(req.chronicle.edit).concat(req.chronicle.user);
  if(req.body.data == 1){
    User.updateQ({_id: {$in: users}},
      {$push: {'updates': {chronicle: req.chronicle._id, user: req.login.name, event: req.event._id, eventedit: true}}
      },
      {multi: true}
    ).then(res.success).catch(console.log);
  }
  else if(req.body.data == 2){
    User.updateQ({_id: {$in: users}},
      {$push: {'updates': {chronicle: req.chronicle._id, user: req.login.name, event: req.event._id, eventedit: false}}
      },
      {multi: true}
    ).then(res.success).catch(console.log);
  }
  else{
    console.log(req.login.name);
    User.updateQ({_id: {$in: users}},
      {$push: {'updates': {chronicle: req.chronicle._id, user: req.login.name, event: req.event._id, content: req.body.data}}
      },
      {multi: true}
    ).then(res.success).catch(console.log);
  }
});
*/

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
  res.success(req.login || {});
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