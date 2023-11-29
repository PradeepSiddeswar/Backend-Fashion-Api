const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    image: String,
    title: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CategoryDetails' // This should match the model name of the CategoryDetails schema
    }
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;