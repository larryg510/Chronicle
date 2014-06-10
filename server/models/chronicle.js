var express     = require('express')
  , mongoose    = require('mongoose')
  , Q           = require('q')
  , Schema      = mongoose.Schema
;

var ContentSchema = new Schema({
 format: String,
 content: String,
 //owner: { type: Schema.Types.ObjectId, ref: 'user'}
});

/* ContentSchema.virtuals('url').get(function(){
 if(this.type === 'image') return '/images/' + this._id.toString();
})
*/

var EventSchema = new Schema({
 color: String,
 content: [ContentSchema],
 metadata: {
   title: String,
   names: String,
   location: String,
   time: String,
   description: String,
 }, 
 //owner: { type: Schema.Types.ObjectId, ref: 'user'}
});

var ChronicleSchema = new Schema({
 user: { type: Schema.Types.ObjectId, ref: 'user'},
 title: String,
 events: [EventSchema],
}, {
 toJSON: {
   virtuals: true
 }
});

var Chronicle = module.exports = mongoose.model('Chronicle', ChronicleSchema);