const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Content: { type: String, required: true },
  Category: { type: String, required: true },
  AdministratorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
});

const KnowledgeBaseModel = mongoose.model('KnowledgeBase', knowledgeBaseSchema);

module.exports = KnowledgeBaseModel;
