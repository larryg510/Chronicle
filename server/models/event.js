var express     = require('express')
  , mongoose    = require('mongoose')
  , Q           = require('q')
  , Schema      = mongoose.Schema
;

var EventSchema = new Schema({
  chronicle: { type: Schema.Types.ObjectId, ref: 'chronicle'},
  title: String,
  description: String
}, {
  toJSON: {
    virtuals: true
  }
});

var Event = module.exports = mongoose.model('Event', EventSchema);