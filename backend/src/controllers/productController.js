const Product = require('../models/Product');
const QRCode = require('qrcode');
const Manual = require('../models/Manual');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');


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


// Update existing product
exports.updateProduct = async (req, res) => {
  try {
    const { name, serialNumber } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, serialNumber },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product and its manuals
exports.deleteProduct = async (req, res) => {
  try {
    // 1) Find the product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 2) Delete each manual’s file and DB record
    const manuals = await Manual.find({ product: product._id });
    for (const m of manuals) {
      // Compute on-disk path from the stored URL
      const relPath = m.fileUrl.split('/uploads/').pop();  
      const filePath = path.join(__dirname, '../../uploads', relPath);
      console.log('Deleting file:', filePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await m.deleteOne();
    }

    // 3) Remove the entire product directory
    const productDir = path.join(__dirname, '../../uploads', product._id.toString());
    console.log('Removing directory:', productDir);
    if (fs.existsSync(productDir)) {
      fs.rmSync(productDir, { recursive: true, force: true });
    }

    // 4) Finally delete the product record
    await product.deleteOne();

    return res.json({ message: 'Product and all its manuals deleted' });
  } catch (err) {
    console.error('deleteProduct error:', err);
    return res
      .status(500)
      .json({
        message: 'Server error during product deletion',
        detail: err.message
      });
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

exports.getAllProducts = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);

    const total = await Product.countDocuments();
    const pages = Math.ceil(total / limit);
    const products = await Product
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('name serialNumber _id');

    res.json({ products, page, pages, total });
  } catch (err) {
    console.error('getAllProducts error:', err);
    res.status(500).json({ message: 'Server error fetching products', detail: err.message });
  }
};

exports.bulkDeleteProducts = async (req, res) => {
  try {
    const ids = req.body.ids; // expect array of product _id strings
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: 'No product IDs provided' });
    }

    // For each product, you can reuse deleteProduct logic or streamline:
    const manuals = await Manual.find({ product: { $in: ids } });
    for (const m of manuals) {
      const rel = m.fileUrl.split('/uploads/').pop();
      const filePath = path.join(__dirname, '../../uploads', rel);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await m.deleteOne();
    }

    // Remove product folders
    for (const id of ids) {
      const dir = path.join(__dirname, '../../uploads', id);
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    }

    // Delete products
    await Product.deleteMany({ _id: { $in: ids } });

    res.json({ message: `Deleted ${ids.length} products` });
  } catch (err) {
    console.error('bulkDeleteProducts error:', err);
    res.status(500).json({ message: 'Server error on bulk delete', detail: err.message });
  }
};

exports.bulkDownloadProducts = async (req, res) => {
  try {
    const ids = (req.query.ids || '').split(',');
    if (!ids.length) return res.status(400).send('No IDs');

    res.setHeader('Content-Disposition', 'attachment; filename="manuals.zip"');
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    // Fetch all manuals for those products
    const manuals = await Manual.find({ product: { $in: ids } });
    manuals.forEach(m => {
      // on-disk path
      const rel = m.fileUrl.split('/uploads/').pop();
      const filePath = path.join(__dirname, '../../uploads', rel);
      // add file into a folder named by product ID
      archive.file(filePath, { name: `${m.product}/${m.title}` });
    });

    await archive.finalize();
  } catch (err) {
    console.error('bulkDownloadProducts error:', err);
    res.status(500).send('Error creating ZIP');
  }
};