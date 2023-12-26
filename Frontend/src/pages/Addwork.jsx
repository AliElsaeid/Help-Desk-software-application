import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";
import Adminnavbar from '../components/Adminnavbar';
import "../stylesheets/Adminaddar.css";

const arbackend = "http://localhost:3000/api/v1/article";

const AddWork = () => {
  const [articles, setArticles] = useState([]);
  const [cookies] = useCookies(['token']);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('type');
  const initialArticleState = {
    title: '',
    content: '',
    type: 'Workflow',
    category: '',
  };
  const [article, setArticle] = useState(initialArticleState);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${arbackend}/articles`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${cookies.token}`
        }
      });
      const filteredArticles = response.data.filter(article =>
        article[filterType].toLowerCase().includes(search.toLowerCase())
      );
      setArticles(filteredArticles);
    } catch (error) {
      toast.error('Failed to retrieve articles. ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isUpdateMode) {
      await handleUpdate();
    } else {
      await handleAddNewArticle();
    }
  };

  const handleAddNewArticle = async () => {
    try {
      await axios.post(`${arbackend}/articles`, article, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${cookies.token}`
        }
      });
      toast.success('Article added successfully!');
      setArticle(initialArticleState);
      fetchArticles();
    } catch (error) {
      toast.error('Failed to add article. ' + error.response.data.message);
    }
  };

  const handleUpdate = async () => {
    if (!currentArticleId) {
      toast.error('No article is selected for updating.');
      return;
    }
    try {
      await axios.put(`${arbackend}/articles/${currentArticleId}`, article, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${cookies.token}`
        }
      });
      toast.success('Article updated successfully!');
      setArticle(initialArticleState);
      setIsUpdateMode(false);
      setCurrentArticleId(null);
      fetchArticles();
    } catch (error) {
      toast.error('Failed to update article. ' + error.response.data.message);
    }
  };

  const startUpdate = (articleToUpdate) => {
    setIsUpdateMode(true);
    setCurrentArticleId(articleToUpdate._id);
    setArticle({
      title: articleToUpdate.title,
      content: articleToUpdate.content,
      type: articleToUpdate.type,
      category: articleToUpdate.category
    });
  };

  const deleteArticle = async (id) => {
    try {
      await axios.delete(`${arbackend}/articles/${id}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${cookies.token}`
        }
      });
      toast.success('Article deleted successfully!');
      fetchArticles();
    } catch (error) {
      toast.error('Failed to delete article. ' + error.response.data.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  // Removed the formTitleClass since we does not seem to need different class names for add/update
  const formTitleText = isUpdateMode ? "Update Article" : "Add Article";

  return (
    <div>
         <div className="navbar-top-right">
        <Adminnavbar />
      </div>
    <ToastContainer />
    
    {/* Search Section */}
    <div className="search-container-container">
      <h2>Search for Article</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search articles..."
        />
        <select
          value={filterType}
          onChange={handleFilterChange}
        >
          <option value="type">Type</option>
          <option value="category">Category</option>
        </select>
        <button type="submit" className="search-buttons"> Search</button>
      </form>
    

    {/* Articles Listing */}
    <div className="articles-section">
        {articles.map((articleItem) => (
          <div key={articleItem._id} className="article-item">
            <div className="article-content">
              <h3>{articleItem.title}</h3>
              <p>{articleItem.content}</p>
              <p>Type: {articleItem.type}</p>
              <p>Category: {articleItem.category}</p>
            </div>
            <div className="article-actions">
              <button onClick={() => startUpdate(articleItem)} className="article-update-button">Update</button>
              <button onClick={() => deleteArticle(articleItem._id)} className="article-delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
      </div>


    {/* Add Article Form Section */}
    <div className="add-article-container container">
      <h2>{formTitleText}</h2>
      <form onSubmit={handleSubmit} className="article-form">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={article.title}
            onChange={handleChange}
            required
          />
          
          <label>Content:</label>
          <textarea
            name="content"
            value={article.content}
            onChange={handleChange}
            required
          />
          
          <label>Type:</label>
          <select name="type" value={article.type} onChange={handleChange}>
            <option value="Workflow">Workflow</option>
            <option value="KnowledgeBase">KnowledgeBase</option>
          </select>
          
          <label>Category:</label>
          <select name="category" value={article.category} onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Network">Network</option>
          </select>
          
          <button type="submit" className="submit-button">
          
            {formTitleText}
          </button>
          
          {isUpdateMode && (
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setIsUpdateMode(false);
                setArticle(initialArticleState);
                setCurrentArticleId(null);
              }}
            >
              Cancel
            </button>
          )}
      </form>
    </div>
  </div>
);
};

export default AddWork;