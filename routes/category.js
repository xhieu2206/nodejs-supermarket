const express = require('express');
const { body, param} = require('express-validator');

const categoryController = require('../controllers/category');
const Category = require('../models/category');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/admin/categories', [
  body('displayName')
    .trim()
    .isLength({
      min: 5,
      max: 20,
    })
    .withMessage('The length of the displayName must be equal or longer than 5 but less than 21 characters')
    .custom(displayName => {
      return Category.findOne({ displayName })
        .then(foundedCategory => {
          if (foundedCategory) {
            return Promise.reject('This name have been already used, please choose another name for this new Category');
          }
        })
    }),
  body('description')
    .trim()
    .isLength({
      min: 5,
      max: 200,
    })
    .withMessage('The length of the description must be equal or longer than 5 but less than 200 characters'),
], categoryController.addCategory);

router.get('/categories', categoryController.getCategories);

router.get('/categories/:categoryId', categoryController.getCategory);

router.put('/categories/:categoryId', [
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
    .withMessage(`The category doesn't existed, please select a existed category before updating category`),
  body('displayName')
    .trim()
    .isLength({
      min: 5,
      max: 20,
    })
    .withMessage('The length of the name must be equal or longer than 5 but less than 21 characters')
    .custom(displayName => {
      return Category.findOne({ displayName })
        .then(foundedCategory => {
          if (foundedCategory) {
            return Promise.reject();
          }
        })
    })
    .withMessage('This name have been already used, please choose another name for this update Category'),
  body('description')
    .trim()
    .isLength({
      min: 5,
      max: 200,
    })
    .withMessage('The length of the description must be equal or longer than 5 but less than 200 characters'),
], categoryController.updateCategory);

module.exports = router;
