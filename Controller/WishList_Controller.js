// const ProductItem = require('../Model/ProductItem_Model')
// const SimilarItems = require('../Model/SimilarProduct_Model')


// // Create Add-to-Cart Method
// let cart = [];
// exports.createaddToCart = async (req, res) => {
//   try {
//     const { productIds } = req.body;

//     if (!productIds || (Array.isArray(productIds) && productIds.length === 0)) {
//       return res.status(400).json({ error: 'Invalid request format' });
//     }
//     const idsToAdd = Array.isArray(productIds) ? productIds : [productIds];

//     cart.push(...idsToAdd);

//     return res.status(200).json({ message: 'Items added to the WishList Successfully' });
//   } catch (error) {
//     console.error('Error adding items to wish list:', error); // Log error for debugging
//     return res.status(500).json({ error: 'Could not add items to the wish list' });
//   }
// };

// // Multiple Add-to-cart
// exports.getAllItemsInCart = async (req, res) => {
//     try {
//       const itemCartItems = await ProductItem.find({ _id: { $in: cart } });
//       const similarProductCartItems = await SimilarItems.find({ _id: { $in: cart } });
  
//       const cartItems = [...itemCartItems, ...similarProductCartItems];
  
//       if (!cartItems || cartItems.length === 0) {
//         return res.status(404).json({ message: 'No items found in the Wish List' });
//       }
  
//       let totalQuantity = 0;
//       let totalAmount = 0;
  
//       cartItems.forEach((item) => {
//         totalQuantity += item.quantity;
//         totalAmount += item.Mrp * item.quantity * (1 - item.offer / 100);
//       });
  
//       const response = {
//         cartItems: cartItems.map((item) => ({
//           product: item,
//           totalAmount: (item.Mrp * item.quantity * (1 - item.offer / 100)).toFixed(2),
//           totalQuantity: item.quantity,
//         })),
//         totalAmount: totalAmount.toFixed(2),
//         totalQuantity,
//       };
  
//       return res.status(200).json({
//         message: 'All Items Added-To-WishList Successfully',
//         ...response,
//       });
//     } catch (error) {
//       console.error('Error retrieving items:', error);
//       return res.status(500).json({ error: 'Could not retrieve items from the wish List' });
//     }
//   };
  
  
  // exports.removeFromCart = async (req, res) => {
  //   try {
  //     const { itemId } = req.params;
  
    
  //     const indexToRemove = cart.findIndex((item) => item === itemId);
  
  //     if (indexToRemove === -1) {
  //       return res.status(404).json({ message: 'Item not found in the wishList' });
  //     }
  
  //     cart.splice(indexToRemove, 1);
  
  //     return res.status(200).json({ message: 'Item removed from the WishList successfully' });
  //   } catch (error) {
  //     console.error('Error removing item from wishList:', error);
  //     return res.status(500).json({ error: 'Could not remove item from the wishList' });
  //   }
  // };