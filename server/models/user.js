var express     = require('express')
  , mongoose    = require('mongoose')
  , Q           = require('q')
  , Schema      = mongoose.Schema
;

var UserSchema = new Schema({                                                                    
  name:       { type: String, index: 'text', required : true},
  username:   {type: String, required : true, unique : true},
  password:   {type: String, required : true},
  email:      {type: String, required : true},
  info:       {picture: String, description: String},
  sessionId:  String,
  chronicles: [{type: Schema.Types.ObjectId,  ref: 'Chronicle'}],
  
}, {
 toJSON: {
   virtuals: true
 }
});


UserSchema.pre("save", function(next){
  var self = this;
  mongoose.models["User"].findOne({username : self.username}, function(err, results){
    if(err){
      next(err);
    } else if(results){
      console.warn('results', results);
      self.invalidate("username", "username must be unique");
      next(new Error("username must be unique"));
    } else {
      next();
    }
  });
});



var User = module.exports = mongoose.model('User', UserSchema);