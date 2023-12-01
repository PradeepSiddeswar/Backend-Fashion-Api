const mongoose = require('mongoose');

const productItemSchema = new mongoose.Schema({
  name: String,
  Mrp: Number,
  Mop: Number,
  offer: Number,
  size: [{
    size: String,
    Text: String
  }],
  Color: [{
    colors: String,
    Code: String,
  }],
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory', // Reference to the Subcategory model
  },
  image: [String],
  quantity: Number,
  Description: String,
  Specification: String
});

const ProductItem = mongoose.model('ProductItem', productItemSchema);

module.exports = ProductItem;

