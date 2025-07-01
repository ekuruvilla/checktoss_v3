const Manual = require('../models/Manual');
const Product = require('../models/Product');

exports.uploadManual = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const manual = new Manual({
      product: product._id,
      title: req.file.originalname,
      fileUrl
    });
    await manual.save();

    product.manuals.push(manual._id);
    await product.save();

    res.json(manual);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
