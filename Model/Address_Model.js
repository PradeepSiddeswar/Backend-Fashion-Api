const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    FullName : {
        type : String,
        required: true
    },
    MobileNumber: {
        type: Number,
        required: true
    },
    Pincode: {
        type : Number,
        required: true
    },
    AddressHouseNo: {
        type: String,
    },
    City: {
        type: String,
    } ,
    State:{
        type: String,
        required: true
    },
   
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address