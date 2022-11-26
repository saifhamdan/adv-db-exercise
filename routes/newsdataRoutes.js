const express = require('express');

const newsdataController = require('../controllers/newsdataControllers');

const router = express.Router();

router.route('/news').get(newsdataController.getLatestNews);
router.route('/sources').get(newsdataController.getNewsSources);
router.route('/store-news').post(newsdataController.getNewsAndStore);

module.exports = router;
