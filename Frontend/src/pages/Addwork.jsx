import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";

const arbackend = "http://localhost:3000/api/v1/article";

const AddWork = () => {
    const [cookies] = useCookies([]);

  const [article, setArticle] = useState({
    title: '',
    content: '',
    type: 'Workflow', // default to Workflow
    category: '',
  });

  // Function to handle input changes and update the article state
  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  // Function to handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${arbackend}/articles`, article);
      toast.success('Article added successfully!');
      setArticle({ title: '', content: '', type: 'Workflow', category: '' }); // Reset the form
    } catch (error) {
      toast.error('Failed to add article. ' + error.response.data.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Add an Article</h1>
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
        <button type="submit">Add Article</button>
      </form>
    </div>
  );
};

export default AddWork;