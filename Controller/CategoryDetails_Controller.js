const CategoryDetails = require('../Model/CategoryDetails_Model')
const SubCategory = require('../Model/SubCategory_Model')

// Create Category
exports.create = async (req, res) => {
  try {
    const requestData = req.body;

    const newCategoryDetails = new CategoryDetails(requestData);

    const savedCategoryDetails = await newCategoryDetails.save();

    res.status(201).json(savedCategoryDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create SubCategory
exports.createSubcategory = async (req, res) => {
  try {
    const subcategory = new SubCategory(req.body);
    const newSubcategory = await subcategory.save();
    res.json(newSubcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// get method with Category
exports.getAll = async (req, res) => {
  try {
    const records = await CategoryDetails.find().select('-__v');
    const responseData = {
      message: 'All Category Added Successfully',
      Data: records,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Error fetching records', message: error.message });
  }
};

// Get Method SubCategoryDetails

exports.getSubCategory = async (req, res) => {
  try {
    const subcategories = await SubCategory.find({ category: req.params.id }, 'id image title');
    
    const responseData = {
      message: 'All SubCategory Added Successfully',
      SubCategories: subcategories.map(subcategory => ({
        _id: subcategory._id,
        image: subcategory.image,
        ...(subcategory.title && { title: subcategory.title }) 
      })),
    };

    res.json(responseData);
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
      case 'category':
        result = await CategoryDetails.findByIdAndDelete(id);
        break;
      case 'subcategory':
        result = await SubCategory.findByIdAndDelete(id);
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