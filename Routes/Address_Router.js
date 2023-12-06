const express = require('express');
const router = express.Router();
const Address_Controller = require('../Controller/Address_Controller');

// Create a new order
router.post('/', Address_Controller.create);


module.exports = router;