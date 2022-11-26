const Category = require('../models/categoryModel');
const factoryController = require('./factoryController');

exports.getAllCategories = factoryController.getAll(Category);
exports.getCategory = factoryController.getOne(Category);
exports.createCategory = factoryController.createOne(Category);
exports.updateCategory = factoryController.updateOne(Category);
exports.deleteCategory = factoryController.deleteOne(Category);
exports.deleteAllCategories = factoryController.deleteAll(Category);