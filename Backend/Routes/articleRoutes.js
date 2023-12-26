// routes.js
const express = require("express");
const router = express.Router();
const ArticleModel = require('../Models/ArticlesModel');
const authorize  = require('../Middleware/authorizationMiddleware');


// Get all articles
router.get('/articles', async (req, res) => {
  try {
    const articles = await ArticleModel.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/workflows', async (req, res) => {
  try {
    const { category } = req.query; // Use req.query
    if (!category) {
      return res.status(404).json({ message: 'Article not found' });
    }
    const articles = await ArticleModel.find({ type: 'Workflow', category });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// routes.js
router.post('/articlesss', async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm; // Extract searchTerm from req.body

    let articles;
    if (!searchTerm) {
      articles = await ArticleModel.find({ type: 'KnowledgeBase' });
    } else {
      articles = await ArticleModel.find({ type: 'KnowledgeBase', category: searchTerm });
    }

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Create a new article
router.post('/articles', authorize('admin'),async (req, res) => {
  const article = new ArticleModel({
    title: req.body.title,
    content: req.body.content,
    type: req.body.type,
    category: req.body.category,
  });

  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an article using PUT
router.put('/articles/:id',authorize('admin'), async (req, res) => {
    try {
      const article = await ArticleModel.findById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
  
      article.title = req.body.title || article.title;
      article.content = req.body.content || article.content;
      article.type = req.body.type || article.type;
      article.category = req.body.category || article.category;
  
      const updatedArticle = await article.save();
      res.json(updatedArticle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Delete an article
router.delete('/articles/:id',authorize('admin'), async (req, res) => {
  try {
    await ArticleModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;