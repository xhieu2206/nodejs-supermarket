const express = require('express');
const mongoose = require('mongoose');
const { body, param } = require('express-validator');

const subcategoryController = require('../controllers/subcategory');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');

const router = express.Router();

router.post('/categories/:categoryId/subcategories', [
  param('categoryId')
    .custom(categoryId => {
      return Category
        .findOne({
          _id: new mongoose.Types.ObjectId(categoryId),
        })
        .then(category => {
          if (!category) {
            return Promise.reject();
          }
        });
    })
    .withMessage(`The category doesn't existed, please select a existed category before adding a new sub-category`),
  body('displayName')
    .trim()
    .isLength({
      min: 5,
      max: 20,
    })
    .withMessage('The length of the displayName must be equal or longer than 5 but less than 21 characters')
    .custom(displayName => {
      return Subcategory.findOne({ displayName })
        .then(foundedSubcategory => {
          if (foundedSubcategory) {
            return Promise.reject('This name have been already used, please choose another name for this new sub-category');
          }
        })
    }),
  body('description')
    .trim()
    .isLength({
      min: 5,
      max: 200,
    })
    .withMessage('The length of the description must be equal or longer than 5 but less than 200 characters')
], subcategoryController.addSubcategory);

router.get('/subcategories/:subcategoryId', subcategoryController.getSubcategory)

router.get('/categories/:categoryId/subcategories', [
  param('categoryId')
    .custom(categoryId => {
      return Category
        .findOne({
          _id: new mongoose.Types.ObjectId(categoryId),
        })
        .then(category => {
          if (!category) {
            return Promise.reject();
          }
        });
    })
    .withMessage(`The category doesn't existed`),
], subcategoryController.getSubcategoriesByCategoryId);

router.put('/subcategories/:subcategoryId', subcategoryController.updateSubcategory);

module.exports = router;
