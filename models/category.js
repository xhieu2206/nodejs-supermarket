const mongoose = require('mongoose');

const categorySchema = new Schema({
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
    }
  ],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }
});

module.exports = mongoose.model('Category', categorySchema);
