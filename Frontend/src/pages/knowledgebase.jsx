import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylesheets/knowledgebasestyle.css';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/user/articles');
        setArticles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error.message);
        setError('Error fetching articles. Please try again later.');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="articles-list-container">
      <h1>Articles List</h1>

      {loading && <p>Loading articles...</p>}

      {error && <p className="error-message">{error}</p>}

      <ul>
        {articles.map((article) => (
          <li key={article._id} className="article">
            <h2>{article.title}</h2>
            <p>{article.content}</p>
            <p>Type: {article.type}</p>
            <p>Category: {article.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticlesList;
