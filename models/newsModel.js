const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  link: String,
  description: String,
  content: String,
  videoUrl: String,
  imageUrl: String,
  keywords: [String],
  creator: [String],
  country: [String],
  category: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'categories',
    },
  ],
  language: { type: String, required: true },
  createdAt: Date,
  lastModified: Date,
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });

const News = mongoose.model('news', newsSchema);

module.exports = News;
