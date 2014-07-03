var express     = require('express')
  , mongoose    = require('mongoose')
  , Q           = require('q')
  , Schema      = mongoose.Schema
;

var UserSchema = new Schema({
  name:       String,
  sessionId:  String,
  chronicles: [{type: Schema.Types.ObjectId,  ref: 'Chronicle'}],
  read: [{type: Schema.Types.ObjectId, ref: 'Chronicle'}],
  edit: [{type: Schema.Types.ObjectId, ref: 'Chronicle'}]
}, {
 toJSON: {
   virtuals: true
 }
});

var User = module.exports = mongoose.model('User', UserSchema);