const CategoryDetails = require('../Model/CategoryDetails_Model');
const Subcategory = require('../Model/SubCategory_Model');
const ProductItem = require('../Model/ProductItem_Model')

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