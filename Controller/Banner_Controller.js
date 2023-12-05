const Banner = require('../Model/Banner_Model')


exports.create = async (req, res) => {
    try {
        const bannerData = req.body;
        const banner = new Banner(bannerData);
        await banner.save();
        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Method 
exports.getAll = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).send({
            Message: "All images Added Successfully",
            Data: banners
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// delete method
exports.delete = (req, res) => {
    const id = req.params.id
    Banner.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(400).send(`category not found with ${id}`)
            } else {
                res.send("category deleted successfully")
            }
        })
        .catch(error => {
            res.status(500).send(error)
        })
}