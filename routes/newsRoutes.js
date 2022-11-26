const express = require('express');

const newsController = require('../controllers/newsController');

const router = express.Router();

router.route('/')
  .get(newsController.getAllNews)
  .post(newsController.createNews)
  .delete(newsController.deleteAllNews);

router.route('/:id')
  .get(newsController.getNews)
  .patch(newsController.updateNews)
  .delete(newsController.deleteNews);

module.exports = router;
