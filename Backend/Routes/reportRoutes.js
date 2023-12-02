const express = require('express');
const router = express.Router();
const Ratings2 = require('../models/Rating');
const User = require('./UserModel');
const Ticket = require('./TicketModel');
const Ratings = require('./RatingModel');

//GET method to retrieve the user ratings
router.get('/getUserRatings', async (req, res) => {
    try {
// 1-Make sure that the user making the request is an admin
      const isAdmin = req.user.role === 'admin';
  
      if (!isAdmin) {
        return res.status(403).json({ error: 'Access denied. Admin permissions required.' });
      }

// 2-Make sure that the user has made ratings
      const username = req.user.username;
      
      const userRatings = await Ratings.find({ 'user.username': username });
  
      if (userRatings.length === 0) {
        return res.status(404).json({ error: 'User has not made any ratings.' });
      }
  
    //Fetch ratings and populate the user to get the user details
      const usernamesWithRatings = await Ratings.find({ 'user.username': username }).populate('user', 'username');
  
      res.status(200).json(usernamesWithRatings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;