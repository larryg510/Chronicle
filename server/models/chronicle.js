var express     = require('express')
  , mongoose    = require('mongoose')
  , Q           = require('q')
  , Schema      = mongoose.Schema
;

var ContentSchema = new Schema({
 format: String,
 content: String,
 speaker: String,
 owner: { type: Schema.Types.ObjectId, ref: 'User'}
});

/* ContentSchema.virtuals('url').get(function(){
 if(this.type === 'image') return '/images/' + this._id.toString();
})
*/

var EventSchema = new Schema({
 content: [ContentSchema],
 metadata: {
   title: String,
   names: String,
   location: String,
   time: String,
   date: String,
   description: String,
   photo: String,
   color: { type: String, default: function(){
    return "background:hsl(" + Math.floor(Math.random()*360) + ", 100%, 60%)";
   }}
 }, 
 //owner: { type: Schema.Types.ObjectId, ref: 'user'}
});

var ChronicleSchema = new Schema({
user: { type: Schema.Types.ObjectId, ref: 'User'},
read: [{type: Schema.Types.ObjectId, ref: 'User'}],
edit: [{type: Schema.Types.ObjectId, ref: 'User'}],
title: String,
photo: String,
public: {type: Boolean, default: true},
events: [EventSchema],
}, {
 toJSON: {
   virtuals: true
 }
});



var Chronicle = module.exports = mongoose.model('Chronicle', ChronicleSchema);