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
          message: error.message || "An error occurred while saving the category data."
        });
      });
  };