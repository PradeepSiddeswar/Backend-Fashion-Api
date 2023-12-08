const mongoose = require('mongoose');

const deliveryaddressSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true
    },
    MobileNumber: {
        type: Number,
        required: true
    },
    // Pincode: {
    //     type: Number,
    //     required: true
    // },
    Address: {
        type: String,
    },
    // City: {
    //     type: String,
    // },
    // State: {
    //     type: String,
    //     required: true
    // },
    Name: {
        type: String,
        required: true
    },
    Price: {
        type: String,
        required: true
    },
    TotalItems: {
        type: Number,
        required: true
    },
    TotalAmount: {
        type: Number,
        required: true
    }
});

const DeliveryAddress = mongoose.model('DeliveryAddress', deliveryaddressSchema);
module.exports = DeliveryAddress