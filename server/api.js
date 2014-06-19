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

  res.error = function(error){
    res.json(500, { error: error });
  };

  User.findOneQ({ sessionId: req.sessionID }).then(function(user){
    req.login = user;
  }).then(function(){
    next();
  });
});

// map data to req.user using requested id
userRouter.param('user', function(req, res, next, id) {
  User.findbyIdQ(id).then(function(user){
    req.user = user;
    next();
  });
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

userRouter.get('/', function(req, res, next){
  res.success(req.login || 'not logged in');
});

// get current user's chronicle library
userRouter.get('/chronicles', function(req, res, next){
  // Chronicle.findbyIdQ(req.user._id).then(function(chronicle){
  //   res.json(chronicle)
  // })
  // Chronicle.findQ({ user: req.login._id }).then(res.success).catch(res.error);
  res.json(req.user.chronicles);
});

// post new chronicle to user's chronicle library
userRouter.post('/:user/chronicles', function(req, res, next){
  req.body.data.owner = req.user;
  var chronicle =  new Chronicle(req.body.data);
  chronicle.user = req.user._id;
  chronicle.saveQ().thenResolve(chronicle).then(res.success).catch(res.error);
 
});

// get requested user's personal profile
userRouter.get('/:user', function(req, res, next){
  res.success(req.user);
});

// get requested user's chronicle library
userRouter.get('/:user/chronicles', function(req, res, next){
  Chronicle.findQ({ user: req.user._id }).then(res.success).catch(res.error);
});

// use userRouter
router.use('/user', userRouter);

// map data to req.chronicle using requested chronicle id
router.param('chronicle', function(req, res, next, id){
  Chronicle.findByIdQ(id).then(function(chronicle){
    req.chronicle = chronicle;
    next();
  });
  
  // Chronicle.save({_id: Object('5369238f2df443631a888633'), events: []});

  // req.chronicle = fakeChronicle(id);
  // res.json(req.chronicle);

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

// use chronicleRouter
router.use('/user/:user/chronicle/:chronicle', chronicleRouter);

exports.router = router;

exports.loadTemp = function(){
  var chronicle = new Chronicle({_id: mongoose.Types.ObjectId('5369238f2df443631a888633')});

  chronicle.saveQ().then(function(){
    console.log('Dummy Data Chronicle Saved');
  });
}

//===Dummy Data===========================================================
var Faker = require('Faker');

function fakeUser(id){
  return {
    _id: id || new mongoose.Types.ObjectId(),
    username: Faker.Internet.userName(),
    email: Faker.Internet.email(),
    bio: Faker.Lorem.sentences(),
    chronicles: [],
  };
}

function fakeChronicle(id){
  return {
    _id: id || new mongoose.Types.ObjectId(),
    title: Faker.Lorem.words(2).join(' ')
  };
}

function fakeChronicles(max){
  var num = Math.round(Math.random() * (max || 1));
  var chronicles = [];
  for(var i = 0; i < num; i++){
    chronicles.push(fakeChronicle());
  }
  return chronicles;
}

function fakeEvents(max){
  var num = Math.round(Math.random() * (max || 1));
  var events = [];
  for(var i = 0; i < num; i++){
    events.push({
      _id: new mongoose.Types.ObjectId(),
      title: Faker.Lorem.words(2).join(' '),
      created: Faker.Date.recent,
      contents: fakeContents(3),
      background: Faker.Image.abstractImage(150, 150).replace('http://', '//') + '/?' + Math.random()
    });
  }
  return events;
}

function fakeContents(max){
  var num = Math.round(Math.random() * (max || 1));
  var contents = [];
  for(var i = 0; i < num; i++){
    if(Math.random() > 0.5){
      contents.push({
        _id: new mongoose.Types.ObjectId(),
        comment: Faker.Lorem.sentences(),
        author: fakeUser()
      });
    } else {
      contents.push({
        _id: new mongoose.Types.ObjectId(),
        image: Faker.Image.nightlife(150, 150).replace('http://', '//') + '/?' + Math.random(),
        author: fakeUser(),
        created: Faker.Date.recent
      });
    }
  }
  return contents;
}