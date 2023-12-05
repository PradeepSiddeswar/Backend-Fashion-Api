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
      image: String
    }],
    Men: [{
      name: String,
      mrp: String,
      mop: String,
      image: String
    }],
  }
});

const TabsList = mongoose.model('TabsList', tabsListSchema);

module.exports = TabsList;
