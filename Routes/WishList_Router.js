const express = require('express');
const router = express.Router();
const WishList_Controller = require('../Controller/WishList_Controller'); 

router.post('/', WishList_Controller.createaddToCart)

// Add-to-cart Api
router.get('/allitemsInWishlist', WishList_Controller.getAllItemsInCart);

// Delete Method with All Products
router.delete('/removeFromWishList/:itemId', WishList_Controller.removeFromCart);
module.exports = router;