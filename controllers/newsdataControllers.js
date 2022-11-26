const axios = require('axios');

const Category = require('../models/categoryModel');
const News = require('../models/newsModel');
const catchAsync = require('../utils/catchAsync');

const paramsParser = (url) => {
  let params = '';
  if (url.includes('?')) {
    params = '&' + url.split('?')[1];

  }
  return params;
}

exports.getLatestNews = catchAsync(async (req, res) => {
  const params = paramsParser(req.url);
  const response = await axios({
    url: `${process.env.URL}/news?apikey=${process.env.API_KEY}${params}`
  })

  res.status(200).json(response.data);
});

exports.getNewsSources = catchAsync(async (req, res) => {
  const params = paramsParser(req.url);
  const response = await axios({
    url: `${process.env.URL}/sources?apikey=${process.env.API_KEY}${params}`
  })

  res.status(200).json(response.data);
});

exports.getNewsAndStore = async (req, res, next) => {
  // 1) fetch news
  const params = paramsParser(req.url);
  const response = await axios({
    url: `${process.env.URL}/news?apikey=${process.env.API_KEY}${params}`,
  });
  const news = await response.data.results;


  // 2) map fetched news
  const categoires = await Category.find();
  const mappedNews = news.map((n) => {
    const mappedCategories = n.category.map((cat) => {
      const newCat = categoires.find((c) => c.name === cat);
      return newCat._id;
    });

    return {
      ...n,
      videoUrl: n.video_url,
      imageUrl: n.image_url,
      category: mappedCategories,
      createdAt: n.pubDate,
      lastModified: n.pubDate,
    };
  });

  const docs = await News.insertMany(mappedNews);

  res.status(200).json({
    status: 'status',
    totalResults: docs.length,
    data: docs,
  });
};