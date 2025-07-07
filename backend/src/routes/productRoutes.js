const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  bulkDownloadProducts
} = require('../controllers/productController');

const { requireAuth, requireManufacturer } = require('../middleware/auth');

const router = express.Router();

// Public product reads
router.get('/', getAllProducts);
// Public single product view
router.get('/:id', getProduct);

// Manufacturer bulk operations
router.post('/bulk-delete', requireAuth, requireManufacturer, bulkDeleteProducts);
router.get('/bulk-download', requireAuth, requireManufacturer, bulkDownloadProducts);



// Manufacturer-only mutating routes
router.post('/', requireAuth, requireManufacturer, createProduct);
router.put('/:id', requireAuth, requireManufacturer, updateProduct);
router.delete('/:id', requireAuth, requireManufacturer, deleteProduct);

module.exports = router;
