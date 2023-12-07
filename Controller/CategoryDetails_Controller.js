const CategoryDetails = require('../Model/CategoryDetails_Model');
const Subcategory = require('../Model/SubCategory_Model');
const ProductItem = require('../Model/ProductItem_Model')
const SimilarItems = require('../Model/SimilarProduct_Model')

// category create method
exports.create = async (req, res) => {
  if (!req.body) {
    res.status(400).send("Content Cannot Be Empty");
    return;
  }

  const { name, image } = req.body;

  if (!name || !image) {
    res.status(400).send("Name and image are required fields");
    return;
  }

  const category = new CategoryDetails({
    name: req.body.name,
    image: req.body.image,
  });

  category.save()
    .then(data => {
      res.status(200).send({ status: true, message: "Submitted Successfully", data: data });
    })
    .catch(error => {
      res.status(500).send({
        message: error.message || "An error occurred while saving the category data."
      });
    });
};

// Subcategory Create Method
exports.createSubcategory = async (req, res) => {
  try {
    const subcategory = new Subcategory(req.body);

    const newSubcategory = await subcategory.save();
    res.json(newSubcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create ProductDetails method
exports.createProductDetails = async (req, res) => {
  try {
    const productData = req.body;

    // Check if quantity is provided and if it's less than or equal to 0
    if (!productData.quantity || productData.quantity <= 0) {
      productData.status = 'out of stock';
    } else {
      productData.status = 'in stock';
    }

    // Calculate the total price with the discount applied (decrease of 12%)
    const totalPrice = Number(productData.Mrp) * Number(productData.quantity) * (1 - (Number(productData.offer) / 100));
    const totalQuantity = Number(productData.quantity);



    const product = new ProductItem(productData);
    await product.save();

    const response = {
      product,
      totalPrice: totalPrice.toFixed(2),
      totalQuantity,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error saving product to the database:', error);
    res.status(500).json({ error: 'Could not save the product to the database' });
  }
};

// Create SimilarItems method
exports.createSimilarProducts = async (req, res) => {
  try {
    const productData = req.body;

    if (!productData.quantity || productData.quantity <= 0) {
      productData.status = 'out of stock';
    } else {
      productData.status = 'in stock';
    }

    const totalPrice = Number(productData.Mrp) * Number(productData.quantity) * (1 - (Number(productData.offer) / 100));
    const totalQuantity = Number(productData.quantity);



    const product = new SimilarItems(productData);
    await product.save();

    const response = {
      product,
      totalPrice: totalPrice.toFixed(2),
      totalQuantity,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error saving product to the database:', error);
    res.status(500).json({ error: 'Could not save the product to the database' });
  }
};


// Create Add-to-Cart Method
let cart = [];
exports.createaddToCart = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || (Array.isArray(productIds) && productIds.length === 0)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    const idsToAdd = Array.isArray(productIds) ? productIds : [productIds];

    cart.push(...idsToAdd);

    return res.status(200).json({ message: 'Items added to the cart successfully' });
  } catch (error) {
    console.error('Error adding items to cart:', error); 
    return res.status(500).json({ error: 'Could not add items to the cart' });
  }
};


/// get method with Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoryDetails.find({}, 'id name image');


    const responseData = {
      message: 'All Categories added successfully',
      data: categories
    };

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get Method SubCategory

exports.getSubCategories = async (req, res) => {
  try {
    const category = await CategoryDetails.findById(req.params.id);

    const subcategories = await Subcategory.find({ category: req.params.id }, 'id name image');
    res.json({ id: category.id, name: category.name, subcategories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get method ProductsDetails
exports.getProductsDetails = async (req, res) => {
  try {
    const subcategoryId = req.params.subcategoryId;
    const productItems = await ProductItem.find({ subcategoryId });

    if (productItems.length === 0) {
      return res.status(404).json({ message: 'Product items not found for this ProductDetails' });
    }

    const formattedItems = productItems.map(item => {
      const { quantity, Mrp, offer } = item;
      const totalAmount = Mrp * quantity * (1 - offer / 100);
      const status = quantity > 0 ? 'in stock' : 'out of stock';

      const productDetails = {
        _id: item._id,
        name: item.name,
        Mrp: item.Mrp,
        Mop: item.Mop,
        offer: item.offer,
        Color: item.Color.map(color => ({
          colors: color.colors,
          Code: color.Code
        })),   
        size: item.size.map(size => ({
          size: size.size,
          Text: size.Text
        })),       
         image: item.image.map(imageUrl => ({ url: imageUrl })),
        Description: item.Description,
        Specification: item.Specification,
        quantity: item.quantity,
        status: status
      };

      return {
        message: 'All ProductsDetails is available',
        productDetails,
        totalAmount: totalAmount.toFixed(2), // Calculated total amount
        totalQuantity: item.quantity, // Using the existing quantity
      };
    });

    res.json(formattedItems[0]);
  } catch (err) {
    
    res.status(500).json({ error: err.message });
  }
};

 // Get method Similaritems
 exports.getSimilarProducts = async (req, res) => {
  try {
    const limitCount = 10;

    const products = await SimilarItems
      .find({ subcategoryId: req.params.subcategoryId})
      .limit(limitCount);

    if (products.length === 0) {
      return res.status(404).json({ message: 'SimilarProducts is not available' });
    }

    const similarProducts = products.map(item => ({
      product: {
        _id: item._id,
        name: item.name,
        Mrp: item.Mrp,
        Mop: item.Mop,
        offer: item.offer,
        image: item.image,
        quantity: item.quantity,
        status: item.quantity > 0 ? 'in stock' : 'out of stock'
      },
      totalAmount: (item.Mrp * item.quantity * (1 - (item.offer / 100))).toFixed(2),
      totalQuantity: item.quantity
    }));

    // Return the formatted response
    res.json({
      message: 'All SimilarProducts is available',
      similarProducts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Multiple Add-to-cart
exports.getAllItemsInCart = async (req, res) => {
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
          status: item.status,
        },
        totalAmount: itemTotalAmount.toFixed(2),
        totalQuantity: item.quantity,
      };

      if (item instanceof ProductItem && Array.isArray(item.image) && item.image.length > 0) {
        formattedItem.product.image = item.image.map((imgUrl) => ({ url: imgUrl }));
      } else if (item instanceof ProductItem && !Array.isArray(item.image) && item.image) {
        formattedItem.product.image = [{ url: item.image.url }]; // Use single URL if not an array
      } else if (item instanceof SimilarItems && Array.isArray(item.image) && item.image.length > 0) {
        formattedItem.product.image = item.image.map((imgUrl) => ({ url: imgUrl }));
      } else if (item instanceof SimilarItems && typeof item.image === 'string') {
        formattedItem.product.image = [{ url: item.image }]; // Use string URL directly for SimilarItems
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


// Multiple Add-to-cart
// exports.getAllItemsInWishList= async (req, res) => {
//   try {
//     const itemCartItems = await ProductItem.find({ _id: { $in: cart } });
//     const similarProductCartItems = await SimilarItems.find({ _id: { $in: cart } });

//     const cartItems = [...itemCartItems, ...similarProductCartItems];

//     if (!cartItems || cartItems.length === 0) {
//       return res.status(404).json({ message: 'No items found in the cart' });
//     }

//     let totalQuantity = 0;
//     let totalAmount = 0;

//     const formattedCartItems = cartItems.map((item) => {
//       totalQuantity += item.quantity;

//       let itemTotalAmount = 0;
//       if (item.Mrp && item.quantity && item.offer) {
//         itemTotalAmount = item.Mrp * item.quantity * (1 - item.offer / 100);
//         totalAmount += itemTotalAmount;
//       }

//       const formattedItem = {
//         product: {
//           _id: item._id,
//           name: item.name,
//           Mrp: item.Mrp,
//           Mop: item.Mop,
//           offer: item.offer,
//           image: '', // Default empty string for image URL
//           quantity: item.quantity,
//           status: item.status 
//         },
//         totalAmount: itemTotalAmount.toFixed(2),
//         totalQuantity: item.quantity,
//       };

//       if (item instanceof ProductItem && Array.isArray(item.image) && item.image.length > 0) {
//         formattedItem.product.image = item.image.map((imgUrl) => ({ url: imgUrl }));
//       } else if (item instanceof ProductItem && !Array.isArray(item.image) && item.image) {
//         formattedItem.product.image = [{ url: item.image.url }]; // Use single URL if not an array
//       } else if (item instanceof SimilarItems && typeof item.image === 'string') {
//         formattedItem.product.image = item.image; // Use string URL directly for SimilarItems
//       } else {
//         delete formattedItem.product.image; // Remove image property if not found or doesn't meet conditions
//       }

//       return formattedItem;
//     });

//     const response = {
//       message: 'All Product Items Added-To-Cart Successfully',
//       cartItems: formattedCartItems,
//       totalAmount: totalAmount.toFixed(2),
//       totalQuantity,
//     };

//     return res.status(200).json(response);
//   } catch (error) {
//     console.error('Error retrieving items:', error);
//     return res.status(500).json({ error: 'Could not retrieve items from the cart' });
//   }
// };

/// Remove Method
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

  
    const indexToRemove = cart.findIndex((item) => item === itemId);

    if (indexToRemove === -1) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }

    cart.splice(indexToRemove, 1);

    return res.status(200).json({ message: 'Item removed from the cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ error: 'Could not remove item from the cart' });
  }
};

// /// Remove Method
// exports.removeFromWishList = async (req, res) => {
//   try {
//     const { itemId } = req.params;

  
//     const indexToRemove = cart.findIndex((item) => item === itemId);

//     if (indexToRemove === -1) {
//       return res.status(404).json({ message: 'Item not found in the cart' });
//     }

//     cart.splice(indexToRemove, 1);

//     return res.status(200).json({ message: 'Item removed from the cart successfully' });
//   } catch (error) {
//     console.error('Error removing item from cart:', error);
//     return res.status(500).json({ error: 'Could not remove item from the cart' });
//   }
// };





// Delete method for all entities
exports.delete = async (req, res) => {
  const { entityType, id } = req.params;

  try {
    let result;
    switch (entityType) {
      case 'categories':
        result = await CategoryDetails.findByIdAndDelete(id);
        break;
      case 'subcategories':
        result = await Subcategory.findByIdAndDelete(id);
        break;
      case 'productDetails':
        result = await ProductItem.findByIdAndDelete(id);
        break;
        case 'similarProducts':
        result = await SimilarItems.findByIdAndDelete(id);
        break;
      default:
        return res.status(400).send('Invalid entity type');
    }

    if (!result) {
      return res.status(404).send(`${entityType} not found with ID: ${id}`);
    }

    res.send(`${entityType} Deleted successfully`);
  } catch (error) {
    res.status(500).send(error);
  }
};