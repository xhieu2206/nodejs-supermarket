const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');
const { validationResult } = require('express-validator');

const SECRET_KEY = process.env.SECRET_KEY.trim();
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL.trim();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY.trim();
const ROOT_URL = process.env.ROOT_URL;

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: SENDGRID_API_KEY,
  }
}));

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array()[0].msg;
    return next(error);
  }

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
      const error = new Error();
      error.httpStatusCode = 500;
      next(err);
    });
}

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let foundedUser;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        const error = new Error('User with this email could not be found');
        error.statusCode = 401;
        throw error;
      }
      foundedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isPasswordCorrected => {
      if (!isPasswordCorrected) {
        const error = new Error('Wrong Password');
        error.satusCode = 401;
        throw error;
      }
      const token = jwt.sign({
        userId: foundedUser._id.toString(),
        email: foundedUser.email,
        name: foundedUser.name,
      }, SECRET_KEY, { expiresIn: '24h' });
      res.status(200).json({
        token,
        userId: foundedUser._id.toString(),
        name: foundedUser.name,
        email: foundedUser.email,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.postResetPassword = (req, res, next) => {
  const { email } = req.body;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      err.statusCode = 500;
      next(err);
    }

    const token = buffer.toString('hex');
    User
      .findOne({ email })
      .then(user => {
        if (!user) {
          const error = new Error('No account with this email found');
          error.satusCode = 404;
          throw error;
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        // sending email to the user to reset password
        transporter
          .sendMail({
            to: email,
            from: FROM_EMAIL,
            subject: 'Password Reset',
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="${ROOT_URL}/new-password/${token}">link to set a new password</a></p>
            `,
          })
          .then(() => {
            console.log('Email was sent successfully');
          })
          .catch(() => {
            const error = new Error('Error while sending password reset email');
            error.satusCode = 500;
            throw error;
          })
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      })
  })
}
