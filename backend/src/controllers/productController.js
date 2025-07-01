const Product = require('../models/Product');
const QRCode = require('qrcode');

exports.createProduct = async (req, res) => {
  try {
    const { name, serialNumber } = req.body;
    let product = new Product({ name, serialNumber });
    product = await product.save();

    const url = `${process.env.FRONTEND_URL}/product/${product._id}`;
    const qrCodeImage = await QRCode.toDataURL(url);
    product.qrCodeImage = qrCodeImage;
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('manuals');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
