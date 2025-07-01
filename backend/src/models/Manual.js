const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManualSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  title: String,
  fileUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Manual', ManualSchema);
