var express   = require('express')
  , mongoose  = require('mongoose');

var router = new express.Router();

//Todo: put this in user model
var userRouter = new express.Router();
userRouter.param('user', function(req, res, next, id) {
  req.user = fakeUser(id);
  next();
});

userRouter.get('/', function(req, res, next){
  res.json(fakeUser());
});

userRouter.get('/chronicles', function(req, res, next){
  res.json(fakeChronicles());
});

userRouter.get('/:user', function(req, res, next){
  res.json(req.user);
});

userRouter.get('/:user/chronicles', function(req, res, next){
  res.json(fakeChronicles());
});

router.use('/user', userRouter);

var chronicleRouter = new express.Router();
chronicleRouter.param('chronicle', function(req, res, next, id){
  req.chronicle = fakeChronicle(id);
  next();
});

chronicleRouter.get('/:chronicle', function(req, res, next){
  res.json(req.chronicle);
});

chronicleRouter.get('/:chronicle/events', function(req, res, next){
  res.json(fakeEvents(6));
});

router.use('/chronicle', chronicleRouter);

exports.router = router;

//===Dummy Data===========================================================
var Faker = require('Faker');

function fakeUser(id){
  return {
    _id: id || new mongoose.Types.ObjectId(),
    username: Faker.Internet.userName(),
    email: Faker.Internet.email(),
    bio: Faker.Lorem.sentences()
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