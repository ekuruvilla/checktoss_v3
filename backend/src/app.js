const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const manualRoutes = require('./routes/manualRoutes');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/products', productRoutes);
app.use('/api/manuals', manualRoutes);

module.exports = app;
