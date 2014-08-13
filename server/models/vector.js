var express     = require('express')
  , mongoose    = require('mongoose')
  , Q           = require('q')
  , Schema      = mongoose.Schema
;

var VectorSchema = new Schema({
  origin: { type: Schema.Types.ObjectId, ref: 'User'},
  relation: String,
  destination: {type: Schema.Types.ObjectId, ref: 'User'},
  indexBy: { type: Schema.Types.ObjectId, ref: 'User'}
}, {
 toJSON: {
   virtuals: true
 }
}).index({origin: 1, destination: 1, indexBy: 1}, {unique: true});

VectorSchema.pre('save', function(next){
	this.indexBy = this.origin;
	next();
})

var Vector = module.exports = mongoose.model('Vector', VectorSchema);