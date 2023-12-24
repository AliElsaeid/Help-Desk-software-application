// ArticlesList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import '../stylesheets/knowledgebasestyle.css';
import UserNavbBar from '../components/UserNavbBar';
import AppFooter from '../components/footer';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedArticles, setDisplayedArticles] = useState(5);

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

  const handleViewMore = () => {
    setDisplayedArticles((prev) => prev + 5);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <UserNavbBar />
      <Container className="articles-list-container my-5" style={{ flex: 1 }}>
        <Row className="title-container mb-4">
          <Col>
            <h1>Explore Q&A</h1>
          </Col>
        </Row>

        <Row className="justify-content-center mb-4">
          <Col md={8}>
            <Form.Control 
              type="search"
              placeholder="Search by category" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
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
          {articles.slice(0, displayedArticles).map((article, index) => (
            <Col key={index} md={12} className="mb-4"> {/* Use full width for the card */}
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

        {articles.length > displayedArticles && (
          <Row className="justify-content-center view-more-button-container">
            <Col>
              <Button 
                variant="primary" 
                className="center-button"
                onClick={handleViewMore}
              >
                View More
              </Button>
            </Col>
          </Row>
        )}

      </Container>
      <AppFooter />
    </div>
  );
};

export default ArticlesList;
