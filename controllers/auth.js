const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const SECRET_KEY = process.env.SECRET_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL.trim();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY.trim();

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: SENDGRID_API_KEY,
  }
}));

exports.postSignup = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const newUser = User({
        email,
        password: hashedPassword,
        name,
      });
      return newUser.save();
    })
    .then(user => {
      res.status(201).json({
        message: 'User created Successfully',
        userId: user._id,
      })
    })
    .catch(err => {
      console.log(err);
      const error = new Error();
      error.httpStatusCode = 500;
      next(error);
    });

}
