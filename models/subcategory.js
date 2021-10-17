const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: String,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  }
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
