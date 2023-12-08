const express = require('express');
const router = express.Router();
const DeliveryAddress_Controller = require('../Controller/DeliveryAddress_Controller');

// Create a new order
router.post('/', DeliveryAddress_Controller.create);
router.get('/:id',DeliveryAddress_Controller.getById)
router.delete('/delete/:id',DeliveryAddress_Controller.delete)

module.exports = router;