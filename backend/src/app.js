const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

async function pruneOrphans() {
  const uploadRoot = path.join(__dirname, '../uploads');
  const liveIds = (await Product.find().select('_id')).map(p => p._id.toString());
  const dirs = fs.readdirSync(uploadRoot, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const dir of dirs) {
    if (!liveIds.includes(dir)) {
      fs.rmSync(path.join(uploadRoot, dir), { recursive: true, force: true });
      console.log(`Pruned orphan folder: ${dir}`);
    }
  }
}

pruneOrphans().catch(console.error);

const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const manualRoutes = require('./routes/manualRoutes');
const UPLOAD_DIR = path.join(__dirname, '../uploads');


// make sure uploads folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Public auth endpoints
app.use('/api/auth', authRoutes);
// All product routes now require a valid JWT
// and manufacturer-only routes will be protected inside the router
app.use('/api/products', productRoutes);
app.use('/api/manuals', manualRoutes);



module.exports = app;
