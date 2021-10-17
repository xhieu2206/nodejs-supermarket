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

  const { slug, displayName, description } = req.body;
  const category = new Category({
    slug,
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
