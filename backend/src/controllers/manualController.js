const fs = require('fs');
const path = require('path');
const Manual = require('../models/Manual');
const Product = require('../models/Product');

exports.uploadManuals = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { version, description } = req.body;
    const saved = [];

    for (const file of req.files) {
      const relative = file.path.split('/uploads/').pop();
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${relative}`;

      const manual = await Manual.create({
        product: product._id,
        title: file.originalname,
        fileUrl,
        version,
        description
      });

      product.manuals.push(manual._id);
      saved.push(manual);
    }
    await product.save();
    res.json(saved);
  } catch (err) {
    console.error('uploadManuals error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteManual = async (req, res) => {
  try {
	// Find the manual record
    const manual = await Manual.findById(req.params.manualId);
    if (!manual) return res.status(404).json({ message: 'Manual not found' });
	
	// Compute the on-disk path
    // manual.fileUrl: http://host/uploads/<productId>/manuals/1625…-foo.pdf
    // .split('/uploads/') → [..., '<productId>/manuals/1625…-foo.pdf']
    const relativePath = manual.fileUrl.split('/uploads/').pop();
    const filePath = path.join(__dirname, '../../uploads', relativePath);

    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`File missing on disk: ${filePath}`);
    }

    // Remove manual reference from product
    await Product.findByIdAndUpdate(manual.product, { $pull: { manuals: manual._id } });

    await manual.remove();
    res.json({ message: 'Manual deleted' });
  } catch (err) {
	console.error('deleteManual error:', err);
    res.status(500).json({ message: err.message });
  }
};