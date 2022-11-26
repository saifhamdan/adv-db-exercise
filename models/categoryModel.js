const mongoose = require('mongoose');

const categroySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const Category = mongoose.model('categories', categroySchema);

module.exports = Category;
