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
    Address: {
        type: String,
    },
    TotalAmount: {
        type: Number,
        required: true
    }
});

const DeliveryAddress = mongoose.model('DeliveryAddress', deliveryaddressSchema);
module.exports = DeliveryAddress