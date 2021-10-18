const { validationResult } = require('express-validator');

const Subcategory = require('../models/subcategory');
const Category = require('../models/category');
const mongoose = require('mongoose');

exports.addSubcategory = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = validationErrors.array()[0].msg
    return next(error);
  }

  const { displayName, description } = req.body;
  const { categoryId } = req.params;
  const subcategory = new Subcategory({
    displayName,
    description,
    category: categoryId,
  });

  try {
    const newSubcategory = await subcategory.save();
    const category = await Category.findById(categoryId);
    category.subcategories.push(newSubcategory._id);
    await category.save();
    res
      .status(201)
      .json({
        message: 'Subcategory created successfully',
        subcategory: newSubcategory
      });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
}

exports.getSubcategory = async (req, res, next) => {
  const { subcategoryId } = req.params;
  try {
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      throw new Error('Subcategory not found');
    }
    res
      .status(200)
      .json({
        message: 'Fetched Subcategory successfully',
        subcategory,
      })
  } catch (error) {
    if (error.message === 'Subcategory not found') {
      let err = {};
      err.message = 'Not Found';
      err.data = 'Subcategory not found';
      err.statusCode = 404;
      next(err);
    } else {
      error.statusCode = 500;
      error.data = 'Error while fetching the subcategory, maybe the ID of subcategory has the incorrect format';
      error.message = 'Internal Server Error';
      next(error);
    }
  }
}

exports.getSubcategoriesByCategoryId = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 404;
    error.data = validationErrors.array()[0].msg;
    return next(error);
  }

  const { categoryId } = req.params;
  try {
    const { subcategories } = await Category.findOne({ _id: new mongoose.Types.ObjectId(categoryId) }).populate('subcategories');
    res
      .status(200)
      .json({
        message: 'Fetched Sub-categories successfully',
        subcategories,
      });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
}
