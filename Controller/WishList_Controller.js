const ProductItem = require('../Model/ProductItem_Model')
const SimilarItems = require('../Model/SimilarProduct_Model')



// Create Add-to-Cart Method
let cart = [];
exports.createaddToWishList = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || (Array.isArray(productIds) && productIds.length === 0)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    const idsToAdd = Array.isArray(productIds) ? productIds : [productIds];

    cart.push(...idsToAdd);

    return res.status(200).json({ message: 'Items added to the WishList successfully' });
  } catch (error) {
    console.error('Error adding items to cart:', error); 
    return res.status(500).json({ error: 'Could not add items to the WishList' });
  }
};

// Multiple Add-to-cart
exports.getAllItemsInWishList = async (req, res) => {
    try {
      const itemCartItems = await ProductItem.find({ _id: { $in: cart } });
      const similarProductCartItems = await SimilarItems.find({ _id: { $in: cart } });
  
      const cartItems = [...itemCartItems, ...similarProductCartItems];
  
      if (!cartItems || cartItems.length === 0) {
        return res.status(404).json({ message: 'No items found in the WishList' });
      }
  
      let totalQuantity = 0;
      let totalAmount = 0;
  
      const formattedCartItems = cartItems.map((item) => {
        totalQuantity += item.quantity;
  
        let itemTotalAmount = 0;
        if (item.Mrp && item.quantity && item.offer) {
          itemTotalAmount = item.Mrp * item.quantity * (1 - item.offer / 100);
          totalAmount += itemTotalAmount;
        }
  
        const formattedItem = {
          product: {
            _id: item._id,
            name: item.name,
            Mrp: item.Mrp,
            Mop: item.Mop,
            offer: item.offer,
            image: '', // Default empty string for image URL
            quantity: item.quantity,
            status: item.status 
          },
          totalAmount: itemTotalAmount.toFixed(2),
          totalQuantity: item.quantity,
        };
  
        if (item instanceof ProductItem && Array.isArray(item.image) && item.image.length > 0) {
          formattedItem.product.image = item.image.map((imgUrl) => ({ url: imgUrl }));
        } else if (item instanceof ProductItem && !Array.isArray(item.image) && item.image) {
          formattedItem.product.image = [{ url: item.image.url }]; // Use single URL if not an array
        } else if (item instanceof SimilarItems && typeof item.image === 'string') {
          formattedItem.product.image = item.image; // Use string URL directly for SimilarItems
        } else {
          delete formattedItem.product.image; // Remove image property if not found or doesn't meet conditions
        }
  
        return formattedItem;
      });
  
      const response = {
        message: 'All Product Items Added-To-WishList Successfully',
        cartItems: formattedCartItems,
        totalAmount: totalAmount.toFixed(2),
        totalQuantity,
      };
  
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error retrieving items:', error);
      return res.status(500).json({ error: 'Could not retrieve items from the WishList' });
    }
  };
  
  
  /// Remove Method
  exports.removeFromWishList = async (req, res) => {
    try {
      const { itemId } = req.params;
  
    
      const indexToRemove = cart.findIndex((item) => item === itemId);
  
      if (indexToRemove === -1) {
        return res.status(404).json({ message: 'Item not found in the WishList' });
      }
  
      cart.splice(indexToRemove, 1);
  
      return res.status(200).json({ message: 'Item removed from the WishList successfully' });
    } catch (error) {
      console.error('Error removing item from wishList:', error);
      return res.status(500).json({ error: 'Could not remove item from the WishList' });
    }
  };
  
  
  