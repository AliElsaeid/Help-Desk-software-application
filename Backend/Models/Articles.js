const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Type: { type: String, required: true},
  Content: { type: String, required: true },
  Category: { type: String, required: true },
  AdministratorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
});

const ArticleModel = mongoose.model('Articles', ArticleSchema);

module.exports = ArticleModel;