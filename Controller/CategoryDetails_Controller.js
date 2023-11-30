const CategoryDetails = require('../Model/CategoryDetails_Model');
const Subcategory = require('../Model/SubCategory_Model');
const ProductItem = require('../Model/ProductItem_Model')

// category create method

exports.createCategory = async (req, res) => {
  try {
    const category = new CategoryDetails(req.body);
    const newCategory = await category.save();
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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


// Create ProductDetails

exports.createProductDetails = async (req, res) => {
  try {
    const productData = req.body;

    // Check if quantity is provided and if it's less than or equal to 0
    if (!productData.quantity || productData.quantity <= 0) {
      productData.status = 'out of stock';
    } else {
      productData.status = 'in stock';
    }

    // Calculate the total price with the discount applied (if any)
    const totalPrice = productData.Mrp * productData.quantity * (1 - productData.offer / 100);
    const totalQuantity = productData.quantity;

    // Add totalPrice and totalQuantity to the productData
    productData.totalPrice = totalPrice.toFixed(2);
    productData.totalQuantity = totalQuantity;

    // Create a new product item using the ProductItem model
    const productItem = new ProductItem(productData);
    await productItem.save();

    // Prepare the response in the desired format
    const formattedResponse = {
      product: {
        quantity: productData.quantity,
        status: productData.status,
        totalAmount: productData.totalPrice,
        totalQuantity: productData.totalQuantity
      },
      total: {
        totalAmount: productData.totalPrice,
        totalQuantity: productData.totalQuantity
      }
    };

    res.status(201).json({ message: 'Product item created successfully', ...formattedResponse });
  } catch (error) {
    console.error('Error saving product item to the database:', error);
    res.status(500).json({ error: 'Could not save the product item to the database' });
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
// exports.getProductsDetails = async (req, res) => {
//   try {
//     const subcategoryId = req.params.subcategoryId;

//     const productItems = await ProductItem.find({ subcategoryId });

//     if (productItems.length === 0) {
//       return res.status(404).json({ message: 'Product items not found for this subcategory' });
//     }

//     const formattedProductItems = productItems.map(item => {
//       const { quantity, Mrp, offer } = item;
//       const totalAmount = Mrp * quantity * (1 - offer / 100);
//       const status = quantity > 0 ? 'in stock' : 'out of stock';

//       return {
//         _id: item._id,
//         name: item.name,
//         Mrp: item.Mrp,
//         Mop: item.Mop,
//         offer: item.offer,
//         size: item.size,
//         Color: item.Color,
//         image: item.image,
//         quantity: item.quantity,
//         Description: item.Description,
//         Specification: item.Specification,
//         status: status,
//         totalAmount: totalAmount.toFixed(2),
//         totalQuantity: item.quantity
//       };
//     });

//     const totalAmount = formattedProductItems.reduce((acc, item) => acc + parseFloat(item.totalAmount), 0);
//     const totalQuantity = formattedProductItems.reduce((acc, item) => acc + item.totalQuantity, 0);

//     const response = {
//       message: 'All Product details are available',
//       productDetails: formattedProductItems.map(item => ({
//         ...item,
//       })),
//       totalAmount: totalAmount.toFixed(2),
//       totalQuantity: totalQuantity
//     };

//     res.json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };




exports.getProductsDetails = async (req, res) => {
  try {
    const subcategoryId = req.params.subcategoryId;
    const productItems = await ProductItem.find({ subcategoryId });

    if (productItems.length === 0) {
      return res.status(404).json({ message: 'Product items not found for this subcategory' });
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
        Color: item.Color,
        size: item.size,
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