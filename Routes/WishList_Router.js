const express = require('express');
const router = express.Router();
const WishList_Controller = require('../Controller/WishList_Controller');


router.post('/add-to-WishList', WishList_Controller.createaddToWishList )

// Add-to-cart Api
router.get('/allitemsInWishList', WishList_Controller.getAllItemsInWishList);

// Delete Method with All Products
router.delete('/removeFromWishList/:itemId', WishList_Controller.removeFromWishList);


module.exports = router;