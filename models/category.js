const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: false,
    },
  ],
});

module.exports = mongoose.model('Category', categorySchema);
