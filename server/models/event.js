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
  color: String,
  content: [ContentSchema],
  //owner: { type: Schema.Types.ObjectId, ref: 'user'}
}, {
  toJSON: {
    virtuals: true
  }
});

var ContentSchema = new Schema({
  format: String,
  content: String,
  //owner: { type: Schema.Types.ObjectId, ref: 'user'}
});

/* ContentSchema.virtuals('url').get(function(){
  if(this.type === 'image') return '/images/' + this._id.toString();
})
*/

var Event = module.exports = mongoose.model('Event', EventSchema);