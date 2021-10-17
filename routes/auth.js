const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');

router.put('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((email, { req }) => {
      return User.findOne({ email })
        .then(user => {
          if (user) {
            return Promise.reject('Email address already existed');
          }
        })
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({
      min: 6,
    })
    .withMessage('The password lenght must be greater than 5 characters'),
  body('name')
    .trim()
    .isLength({
      min: 3,
    })
    .withMessage('The name of user must greater than 2 characters'),
  body('confirmPassword')
    .trim()
    .custom((confirmedPassword, { req }) => {
      if (confirmedPassword !== req.body.password) {
        throw new Error('Passwords have to match!!!');
      }
      return true;
    })
], authController.signup);

router.post('/login', authController.login);

module.exports = router;
