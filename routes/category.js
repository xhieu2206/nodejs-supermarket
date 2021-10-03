const express = require('express');
const { body } = require('express-validator');

const categoryController = require('../controllers/category');
const Category = require('../models/category');

const router = express.Router();

router.post('/admin/categories', [
  body('slug')
    .trim()
    .isString()
    .isLength({
      min: 3,
      max: 20,
    })
    .withMessage('The length of the slug must be longer than 3 but less than 21 characters')
    .custom((value, { req }) => {
      return Category.findOne({ slug: value })
        .then(foundedCategory => {
          if (foundedCategory) {
            return Promise.reject('This slug have been already used, please choose another slug for this new Category');
          }
        })
    }),
  body('displayName')
    .trim()
    .isLength({
      min: 5,
      max: 20,
    })
    .withMessage('The length of the displayName must be equal or longer than 5 but less than 21 characters'),
  body('description')
    .trim()
    .isLength({
      min: 5,
      max: 100,
    })
    .withMessage('The length of the description must be equal or longer than 5 but less than 21 characters')
], categoryController.addCategory);

router.get('/categories/:categoryId', categoryController.getCategory)

module.exports = router;
