const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadManuals, deleteManual } = require('../controllers/manualController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const productId = req.params.productId;
    // uploads/<productId>/manuals
    const dir = path.join(__dirname, '../../uploads', productId, 'manuals');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // prepend timestamp to avoid collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
// Accept up to 20 files, key name 'manuals'
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // allow pdf, doc, docx, images
    const allowed = /\.(pdf|docx?|jpe?g|png|gif)$/i;
    allowed.test(file.originalname)
      ? cb(null, true)
      : cb(new Error('Unsupported file type'), false);
  }
});

const router = express.Router();
// Upload multiple manuals
router.post('/:productId', upload.array('manuals', 20), uploadManuals);
// Delete a manual
router.delete('/:manualId', deleteManual);

module.exports = router;
