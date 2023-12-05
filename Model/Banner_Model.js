const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  Block1: {
    title: String,
    content: [{
      image: String
    }]
  },
  Block2: {
    title: String,
    content: [{
      image: String
    }]
  }
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
