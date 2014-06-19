var express     = require('express')
  , mongoose    = require('mongoose')
  , Q           = require('q')
  , Schema      = mongoose.
  , Chronicle = require('Chronicle')
;

var UserSchema = new Schema({
  name : String,
  id : String,
  chronicles : [{type: Schema.Types.ObjectId,  ref: 'Chronicle'}],
}, {
 toJSON: {
   virtuals: true
 }
});

var User = module.exports = mongoose.model('User', UserSchema);