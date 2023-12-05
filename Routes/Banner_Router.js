const express = require('express');
const router = express.Router();
const Banner_Controller = require('../Controller/Banner_Controller');

// Create a new order
router.post('/', Banner_Controller.create);
router.get('/All', Banner_Controller.getAll)
router.delete('/delete/:id',Banner_Controller.delete)

module.exports = router;