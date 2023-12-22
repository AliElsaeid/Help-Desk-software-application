// Article.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const articlesUrl = "http://localhost:3000/articles"; // Replace with your backend articles route

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState({});

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${articlesUrl}/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id]);

  return (
    <div>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
      {/* Add other fields as needed */}
    </div>
  );
};

export default Article;
