const mongoose = require('mongoose');

const categoryDetailsSchema = new mongoose.Schema({
    image: String,
    name: String,
});

const CategoryDetails = mongoose.model(' CategoryDetails', categoryDetailsSchema);

module.exports = CategoryDetails;