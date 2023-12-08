const DeliveryAddress = require("../Model/DeliveryAddress_Model")

exports.create = async (req, res) => {
    if (!req.body) {
        res.status(400).send(" Content Cont Be Empty");
        return;
    }

    const deliveryaddress = new DeliveryAddress({
        FullName: req.body.FullName,
        MobileNumber: req.body.MobileNumber,
        Pincode: req.body.Pincode,
        AddressHouseNo: req.body.AddressHouseNo,
        City: req.body.City,
        State: req.body.State,
        Name: req.body.Name,
        Price: req.body.Price,
        TotalItems: req.body.TotalItems,
        TotalAmount: req.body.TotalAmount
    });

    deliveryaddress.save()
        .then(data => {
            res.status(200).send({ Message: " Order Placed SuccessFully", Data: data })
        })
        .catch(error => {
            res.status(500).send({
                message: error.message || "An error occurred while saving the address data."
            });
        });
};
// GetById Method
exports.getById = async (req, res) => {
    const id = req.params.id;

    DeliveryAddress.findById(id)
        .then(data => {
            if (!data) {
                return res.status(404).send({ message: "DeliveryAddress not found with id " + id });
            }
            res.status(200).send({ Message: "DeliveryAddress found", Data: data });
        })
        .catch(error => {
            res.status(500).send({ message: "Error retrieving DeliveryAddress with id " + id });
        });
};


// Delete method
exports.delete = (req, res) => {
    const id = req.params.id
    DeliveryAddress.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(400).send(`address not found with ${id}`)
            } else {
                res.send({ Message: "Delivery Address Deleted Succesfully" })
            }
        })
        .catch(error => {
            res.status(500).send(error)
        })
}