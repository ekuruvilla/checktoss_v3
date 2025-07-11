const fs = require('fs');
const path = require('path');
const Manual = require('../models/Manual');
const Product = require('../models/Product');

exports.uploadManuals = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { version, description } = req.body;
    const saved = [];

    for (const file of req.files) {
      const relative = file.path.split('/uploads/').pop();
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${relative}`;

      const manual = new Manual({
        product:     product._id,
        title:       file.originalname,
        fileUrl,
        version,
        description
      });
      await manual.save();
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
	console.log('⏱ deleteManual called with id:', req.params.id);
  try {
	// Find the manual record
    const manual = await Manual.findById(req.params.id);
    if (!manual) {
      console.log('⚠️ No manual found for id:', req.params.id);
      return res.status(404).json({ message: 'Manual not found' });
    }
	
	// Compute the on-disk path
    const rel = manual.fileUrl.split('/uploads/').pop();
    const filePath = path.join(__dirname, '../../uploads', rel);

    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`File missing on disk: ${filePath}`);
    }
	
	// Remove the manual record
    await manual.deleteOne();
	
	// If you keep a manuals[] on Product, pull it out here
    await Product.updateOne(
      { _id: manual.product },
      { $pull: { manuals: manual._id } }
    );

    res.json({ message: 'Manual deleted' });
  } catch (err) {
	console.error('deleteManual error:', err);
    res.status(500).json({ message: err.message });
  }
};