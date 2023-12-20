// ArticlesList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import '../stylesheets/knowledgebasestyle.css';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/v1/users/articlesss', { searchTerm });
      setArticles(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchArticles();
  };

  return (
    <Container className="articles-list-container my-5">
      <Row className="title-container mb-4">
        <Col>
          <h1>Explore Q&A</h1>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
      <div className="h4 pb-2 mb-4 text-white border-bottom border-white">

        <Col md={8}>
          <Form.Control 
            type="text" 
            placeholder="Search by category" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        </div>
        <Col md={4}>
          <Button 
            variant="primary" 
            className="search-button"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Col>
      </Row>

      {loading && (
        <Row className="justify-content-center">
          <Spinner animation="border" role="status" className="loading-spinner"/>
        </Row>
      )}

      {error && (
        <Row className="justify-content-center">
          <p className="error-message">{error}</p>
        </Row>
      )}

      <Row className="justify-content-center">
        {articles.map((article, index) => (
          <Col key={index} md={8} lg={6} className="mb-4">
            <Card className="article-card">
              <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>{article.content}</Card.Text>
                <Card.Text>Category: {article.category}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ArticlesList;
