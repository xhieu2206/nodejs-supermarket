const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@supermarket1.ffkqs.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`;

const categoryRoutes = require('./routes/category');

const app = express();

/*
  setup middlewares
 */

app.use(bodyParser.json());

// *********************

/*
 * Routes
 */

app.use(categoryRoutes);

// *********************

/*
 * Error handling
 */

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(statusCode).json({
    message,
    data,
  });
});

// *********************

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('CONNECTED!!!');
    app.listen(process.env.PORT);
  })
  .catch(err => console.log(err));
