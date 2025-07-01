const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadManual } = require('../controllers/manualController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const router = express.Router();
router.post('/:productId', upload.single('manual'), uploadManual);

module.exports = router;
