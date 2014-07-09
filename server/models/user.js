var express     = require('express')
  , mongoose    = require('mongoose')
  , Q           = require('q')
  , Schema      = mongoose.Schema
;

var UserSchema = new Schema({
  name:       { type: String, index: 'text' },
  sessionId:  String,
  chronicles: [{type: Schema.Types.ObjectId,  ref: 'Chronicle'}]
}, {
 toJSON: {
   virtuals: true
 }
});

var User = module.exports = mongoose.model('User', UserSchema);