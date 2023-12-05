const TabsList = require("../Model/TabsList_Model")

exports.create = async (req, res) => {
    try {
      const { type, name, mrp, mop, image } = req.body;
  
      let fashionData = await TabsList.findOne({ name: 'TabsList' });
  
      if (!fashionData) {
        const newTabsList = new TabsList({ name: 'TabsList', content: {} });
        fashionData = await newTabsList.save();
      }
  
      if (!Object.keys(fashionData.content).includes(type)) {
        return res.status(400).json({ Message: "Invalid fashion category" });
      }
  
      const category = fashionData.content[type];
      category.push({ name, mrp, mop, image });
  
      await TabsList.findOneAndUpdate(
        { name: 'TabsList' },
        { [`content.${type}`]: category },
        { new: true }
      );
  
      const updatedFashionData = await TabsList.findOne({ name: 'TabsList' });
  
      // Constructing the desired response structure
      const responseData = {
        Message: "Tabs fetched successfully",
        Data: {
          Fashion: [{
            name: "Fashion",
            tab: Object.keys(updatedFashionData.content).map(type => ({ type })),
            total_count: Object.keys(updatedFashionData.content).length,
            content: updatedFashionData.content
          }]
        }
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ Message: "Error adding fashion item", error: error.message });
    }
  };

  // Get Method
  exports.getAll = async (req, res) => {
    try {
      const fashionData = await TabsList.findOne({ name: 'TabsList' });
  
      if (!fashionData) {
        return res.status(404).json({ Message: "Fashion data not found" });
      }
  
      const categoriesToRemove = ['Kids', 'HealthCare'];
  
      // Filter out specific categories from the content
      const filteredContent = Object.fromEntries(
        Object.entries(fashionData.content)
          .filter(([key]) => !categoriesToRemove.includes(key))
      );
  
      const responseData = {
        Message: "Tabs fetched successfully",
        Data: {
          Fashion: [{
            name: "Fashion",
            tab: Object.keys(filteredContent).map(type => ({ type })),
            total_count: Object.keys(filteredContent).length,
            content: filteredContent
          }]
        }
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ Message: "Error fetching fashion items", error: error.message });
    }
  };
  


  // delete method
  exports.delete= async (req, res) => {
    try {
      const { type, itemId } = req.params; // Assuming the item ID is provided as a URL parameter
  
      const fashionData = await TabsList.findOne({ name: 'TabsList' });
  
      if (!fashionData || !Object.keys(fashionData.content).includes(type)) {
        return res.status(404).json({ Message: "Fashion category not found" });
      }
  
      const category = fashionData.content[type];
      const index = category.findIndex(item => String(item._id) === itemId);
  
      if (index === -1) {
        return res.status(404).json({ Message: "Fashion item not found" });
      }
  
      // Remove the item from the category
      category.splice(index, 1);
  
      await TabsList.findOneAndUpdate(
        { name: 'TabsList' },
        { [`content.${type}`]: category },
        { new: true }
      );
  
      const updatedFashionData = await TabsList.findOne({ name: 'TabsList' });
  
      // Construct the response
      const responseData = {
        Message: "Fashion item deleted successfully",
        Data: {
          Fashion: [{
            name: "Fashion",
            tab: Object.keys(updatedFashionData.content).map(type => ({ type })),
            total_count: Object.keys(updatedFashionData.content).length,
            content: updatedFashionData.content
          }]
        }
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ Message: "Error deleting fashion item", error: error.message });
    }
  };