const Address = require("../Model/Address_Model")

// Create method
exports.create = async (req, res) => {
    if (!req.body) {
      res.status(400).send("Content Cannot Be Empty");
      return;
    }
 
    const address = new Address({
      FullName: req.body.FullName,
      MobileNumber: req.body.MobileNumber,
      Pincode: req.body.Pincode,
      AddressHouseNo: req.body.AddressHouseNo,
      City: req.body.City,
      State: req.body.State
    });
  
    address.save()
      .then(data => {
        res.status(200).send({  message: " Address Submitted Successfully", Data: data });
      })
      .catch(error => {
        res.status(500).send({
          message: error.message || "An error occurred while saving the address data."
        });
      });
  };

 

// Get Method 
exports.getAll = async (req, res) => {
    try {
        const address = await Address.find();
        res.status(200).send({
            Message: "All Address Added Successfully",
            Data: address
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

 // Update Method 

 exports.update = async (req, res) => {
    if (!req.body) {
        res.status(400).send("Content cannot be empty");
        return;
    }

    const id = req.params.id; 

    Address.findByIdAndUpdate(id, req.body, { new: true })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Address with id=${id}. Address not found.`
                });
            } else {
                res.status(200).send({ message: "Address updated successfully", Data: data });
            }
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || `Error updating Address with id=${id}`
            });
        });
};


// Delete method
exports.delete = (req, res) => {
    const id = req.params.id
    Address.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(400).send(`address not found with ${id}`)
            } else {
                res.send({Message: "Address Deleted Succesfully"})
            }
        })
        .catch(error => {
            res.status(500).send(error)
        })
}