var express     = require('express')
  , mongoose    = require('mongoose')
  , Q           = require('q')
  , Schema      = mongoose.Schema
;

var UpdateSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  chronicle: {type: Schema.Types.ObjectId, ref: 'Chronicle'},
  event: { type: Schema.Types.ObjectId, ref: 'Event'},
  obj: Schema.Types.Mixed,
  object: String,
  verb: String,
  actor: String,
  target: String,
  read: [{type: Schema.Types.ObjectId, ref: 'User'}],
  date: Date
}, {
 toJSON: {
   virtuals: true
 }
});

// updates: [{chronicle: {type: Schema.Types.ObjectId, ref: 'Chronicle'}, chronicletitle: String, user: String, event: String, eventtitle: String, eventedit: Boolean, content: {format: String, content: String}, read: {type: Boolean, default: false}}]



var Update = module.exports = mongoose.model('Update', UpdateSchema);