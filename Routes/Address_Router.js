const express = require('express');
const router = express.Router();
const Address_Controller = require('../Controller/Address_Controller');

// Create a new order
router.post('/', Address_Controller.create);
router.put('/update/:id', Address_Controller.update);
router.get('/All', Address_Controller.getAll)
router.delete('/delete/:id',Address_Controller.delete)

module.exports = router;