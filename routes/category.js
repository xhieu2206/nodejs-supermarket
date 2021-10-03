const express = require('express');

const categoryController = require('../controllers/category');

const router = express.Router();

router.post('/admin/categories', categoryController.addCategory);

router.get('/categories/:categoryId', categoryController.getCategory)

module.exports = router;
