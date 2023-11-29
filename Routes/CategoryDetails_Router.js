const express = require('express');
const router = express.Router();
const CategoryDetails_Controller = require('../Controller/CategoryDetails_Controller');

// Create Post router
router.post('/', CategoryDetails_Controller.create);
router.post('/subcategories', CategoryDetails_Controller.createSubcategory);


// Create Get router
router.get('/getAll', CategoryDetails_Controller.getAll)
router.get('/subcategories/:id', CategoryDetails_Controller.getSubCategory);

router.delete('/:entityType/:id',CategoryDetails_Controller.delete)

module.exports = router;