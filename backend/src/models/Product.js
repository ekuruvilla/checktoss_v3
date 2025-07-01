const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  serialNumber: String,
  qrCodeImage: String,
  manuals: [{ type: Schema.Types.ObjectId, ref: 'Manual' }]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
