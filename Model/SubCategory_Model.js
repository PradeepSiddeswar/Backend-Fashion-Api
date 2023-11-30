
const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  image: String,
  name: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategoryDetails',
  },
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;