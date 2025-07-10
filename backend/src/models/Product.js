const mongoose = require('mongoose');

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function generateCode() {
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const ProductSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  serialNumber: { type: String },
  productCode:  { type: String, unique: true, index: true },
  qrCodeImage:  { type: String },
}, { timestamps: true });

// On new documents, generate a unique 8-char code
ProductSchema.pre('save', async function(next) {
  if (this.isNew && !this.productCode) {
    let code;
    do {
      code = generateCode();
    } while (await mongoose.models.Product.exists({ productCode: code }));
    this.productCode = code;
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
