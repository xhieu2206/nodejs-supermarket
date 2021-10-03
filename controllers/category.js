const Category = require('../models/category');

exports.addCategory = (req, res, next) => {
  const { name, description } = req.body;
  const category = new Category({
    name,
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
      console.log(err);
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
      console.log(err);
    });
}
