const express = require('express');
const router = express.Router();
const CategoryDetails_Controller = require('../Controller/CategoryDetails_Controller');
const HomePage_Multer = require("../Config/HomePage_Multer")

// Create Method with Post Api
router.post('/categories', HomePage_Multer.single("image"),CategoryDetails_Controller.create);
router.post('/subcategories', CategoryDetails_Controller.createSubcategory);
router.post('/productDetails',CategoryDetails_Controller.createProductDetails)
router.post('/similarProducts', CategoryDetails_Controller.createSimilarProducts)
router.post('/add-to-cart', CategoryDetails_Controller.createaddToCart)
// router.post('/add-to-WishList', CategoryDetails_Controller.createaddToWishList)


// Get Method with Api
router.get('/categories', CategoryDetails_Controller.getCategories);
router.get('/subcategories/:id', CategoryDetails_Controller.getSubCategories);
router.get('/productDetails/:subcategoryId', CategoryDetails_Controller.getProductsDetails);
router.get('/similarProducts/:subcategoryId', CategoryDetails_Controller.getSimilarProducts);

// Add-to-cart Api
router.get('/allitemsIncart', CategoryDetails_Controller.getAllItemsInCart);
// router.get('/allitemsInWishList', CategoryDetails_Controller.getAllItemsInWishList);


// Delete Method with All Products
router.delete('/removeFromCart/:itemId', CategoryDetails_Controller.removeFromCart);
// router.delete('/removeFromWishList/:itemId', CategoryDetails_Controller.removeFromWishList);

router.delete('/:entityType/:id',CategoryDetails_Controller.delete);


module.exports = router;