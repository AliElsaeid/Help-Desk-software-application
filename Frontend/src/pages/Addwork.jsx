import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";
import "../stylesheets/Adminaddar.css";


const arbackend = "http://localhost:3000/api/v1/article";

const AddWork = () => {
  const [articles, setArticles] = useState([]);
  const [cookies] = useCookies(['token']);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);
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
      setArticles(response.data);
    } catch (error) {
      toast.error('Failed to retrieve articles. ' + error.response.data.message);
    }
  };

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
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

  return (
    <div>
      <ToastContainer />
      <h1>{isUpdateMode ? 'Update' : 'Add'} an Article</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '50%' }}>
          {articles.map((articleItem) => (
            <div key={articleItem._id} style={{ marginBottom: '10px'}}>
              <h3>{articleItem.title}</h3>
              <p>{articleItem.content}</p>
              <p>Type: {articleItem.type}</p>
              <p>Category: {articleItem.category}</p>
              <button onClick={() => startUpdate(articleItem)}>Update</button>
              <button onClick={() => deleteArticle(articleItem._id)}>Delete</button>
            </div>
          ))}
        </div>
        
        <div style={{ width: '50%' }}>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={article.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Content:</label>
              <textarea
                name="content"
                value={article.content}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Type:</label>
              <select name="type" value={article.type} onChange={handleChange}>
                <option value="Workflow">Workflow</option>
                <option value="KnowledgeBase">KnowledgeBase</option>
              </select>
            </div>
            <div>
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={article.category}
                onChange={handleChange}
              />
            </div>
            <button type="submit">{isUpdateMode ? 'Update' : 'Add'} Article</button>
            {isUpdateMode && (
              <button type="button" onClick={() => {
                setIsUpdateMode(false);
                setArticle(initialArticleState);
                setCurrentArticleId(null);
              }}>Cancel</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWork;