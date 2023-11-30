const CategoryDetails = require('../Model/CategoryDetails_Model');
const Subcategory = require('../Model/SubCategory_Model');


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


// Get Method CategoryDetails

exports.getSubCategories = async (req, res) => {
  try {
    const category = await CategoryDetails.findById(req.params.id);
    const subcategories = await Subcategory.find({ category: req.params.id }, 'id name image');
    res.json({ id: category.id, name: category.name, subcategories });
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
        result = await Subcategory.findByIdAndDelete(id);
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