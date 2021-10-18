const Category = require('../models/category');
const { validationResult } = require('express-validator');

exports.addCategory = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = validationErrors.array()[0].msg
    return next(error);
  }

  const { displayName, description } = req.body;
  const category = new Category({
    displayName,
    description,
  });
  category.save()
    .then(category => {
      res.status(201).json({
        message: 'Category created successfully',
        category,
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.getCategory = (req, res, next) => {
  const categoryId = req.params['categoryId'];

  Category.findById(categoryId)
    .then(category => {
      res.status(200).json({
        message: 'Fetch Category successfully',
        category,
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.getCategories = (req, res, next) => {
  Category.find()
    .then(categories => {
      res
        .status(200)
        .json({
          message: 'Fetched categories successfully',
          categories,
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.updateCategory = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = validationErrors.array()[0].msg
    return next(error);
  }

  const { categoryId } = req.params;
  const { displayName, description } = req.body;

  try {
    const category = await Category.findById(categoryId);
    category.displayName = displayName;
    category.description = description;
    const updatedCategory = await category.save();
    res
      .status(200)
      .json({
        message: 'Category updated successfully',
        category: updatedCategory,
      })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
