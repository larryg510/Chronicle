var express     = require('express')
  , mongoose    = require('mongoose')
  , Q           = require('q')
  , Schema      = mongoose.Schema
;

var UserSchema = new Schema({
  name:       { type: String, index: 'text' },
  sessionId:  String,
  chronicles: [{type: Schema.Types.ObjectId,  ref: 'Chronicle'}],
  updates: [{chronicle: {type: Schema.Types.ObjectId, ref: 'Chronicle'}, user: String, event: String, eventedit: Boolean, content: {format: String, content: String}, read: {type: Boolean, default: false}}]
}, {
 toJSON: {
   virtuals: true
 }
});

var User = module.exports = mongoose.model('User', UserSchema);