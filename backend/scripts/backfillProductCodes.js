#!/usr/bin/env node
/**
 * Script to backfill existing Products with a unique 8-char alphanumeric productCode.
 * Usage: node backfillProductCodes.js
 * Make sure MONGO_URI is set in your environment or in a .env file.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function generateCode() {
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function backfill() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('Error: MONGO_URI not set.');
      process.exit(1);
    }
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB.');

    const cursor = Product.find({ productCode: { $exists: false } }).cursor();
    let count = 0;

    for (let doc = await cursor.next(); doc; doc = await cursor.next()) {
      let code;
      do {
        code = generateCode();
      } while (await Product.exists({ productCode: code }));
      doc.productCode = code;
      await doc.save();
      console.log(`Product ${doc._id} assigned code: ${code}`);
      count++;
    }

    console.log(`Backfilled ${count} product(s).`);
    process.exit(0);
  } catch (err) {
    console.error('Backfill error:', err);
    process.exit(1);
  }
}

backfill();
