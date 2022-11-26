const News = require('../models/newsModel');

const factoryController = require('./factoryController');

const popOptions = { path: 'category', select: '-__v' };

exports.getAllNews = factoryController.getAll(News, popOptions);
exports.getNews = factoryController.getOne(News, popOptions);
exports.createNews = factoryController.createOne(News);
exports.updateNews = factoryController.updateOne(News);
exports.deleteNews = factoryController.deleteOne(News);
exports.deleteAllNews = factoryController.deleteAll(News);

