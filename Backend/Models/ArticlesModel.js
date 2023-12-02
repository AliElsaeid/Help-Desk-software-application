
const mongoose = require('mongoose');
const User = require('./UserModel');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Workflow', 'KnowledgeBase'], 
    required: true,
  },
  category: String,


});

const ArticleModel = mongoose.model('Article', ArticleSchema);

module.exports = ArticleModel;
