const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  bulkDownloadProducts
} = require('../controllers/productController');

router.post('/', createProduct);
router.get('/', getAllProducts);
router.post('/bulk-delete', bulkDeleteProducts);
router.get('/bulk-download', bulkDownloadProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct); 


module.exports = router;


