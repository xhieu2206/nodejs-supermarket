const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
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
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
  ],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }
});

module.exports = mongoose.model('Category', categorySchema);
