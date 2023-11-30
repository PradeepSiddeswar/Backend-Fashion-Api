const express = require('express');
const router = express.Router();
const CategoryDetails_Controller = require('../Controller/CategoryDetails_Controller');


// Create Method with Post Api
router.post('/categories', CategoryDetails_Controller.createCategory);
router.post('/subcategories', CategoryDetails_Controller.createSubcategory);
// router.post('/items', categoryController.createItem);
router.post('/productDetails',CategoryDetails_Controller.createProductDetails)
// router.post('/similarProducts', categoryController.createSimilarProducts)
// router.post('/add-to-cart', categoryController.createaddToCart)


// Get Method with Api
router.get('/categories', CategoryDetails_Controller.getCategories);
router.get('/subcategories/:id', CategoryDetails_Controller.getSubCategories);
// router.get('/categories/:categoryId/subcategories/:subcategoryId', categoryController.getSubcategoryItems);
router.get('/productDetails/:subcategoryId', CategoryDetails_Controller.getProductsDetails);
// router.get('/similarProducts/:productId', categoryController.getSimilarProducts);

// Add-to-cart Api
// router.get('/allitemsIncart', categoryController.getAllItemsInCart);

// Delete Method with All Products
// router.delete('/removeFromCart/:itemId', categoryController.removeFromCart);
router.delete('/:entityType/:id',CategoryDetails_Controller.delete);


module.exports = router;