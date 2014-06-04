var express     = require('express')
  , mongoose    = require('mongoose')
  , Q           = require('q')
  , Schema      = mongoose.Schema
;

var EventSchema = new Schema({
  chronicle: { type: Schema.Types.ObjectId, ref: 'chronicle'},
  title: String,
  names: String,
  location: String,
  time: String,
  description: String,
  color: String
}, {
  toJSON: {
    virtuals: true
  }
});

var Event = module.exports = mongoose.model('Event', EventSchema);