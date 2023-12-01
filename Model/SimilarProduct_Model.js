const mongoose = require('mongoose');

const similarSchema = new mongoose.Schema({
  name: String,
  Mrp: Number,
  Mop: Number,
  offer: Number,
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory', // Reference to the Subcategory model
  },
  image: String,
  quantity: Number,
});

const SimilarItems = mongoose.model('SimilarItems', similarSchema);

module.exports = SimilarItems;