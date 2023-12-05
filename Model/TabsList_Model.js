const mongoose = require('mongoose');

const tabsListSchema = new mongoose.Schema({
  name: String,
  tab: [{ type: String }],
  total_count: Number,
  content: {
    Womens: [{
      name: String,
      mrp: String,
      mop: String,
      image: String,
      offer: Number,
      quantity: Number,
      totalPrice: String,
      totalQuantity: Number,
    }],
    Men: [{
      name: String,
      mrp: String,
      mop: String,
      offer: Number,
      quantity: Number,
      image: String,
      totalPrice: String,
      totalQuantity: Number,
    }],
  }
});


const TabsList = mongoose.model('TabsList', tabsListSchema);

module.exports = TabsList;

