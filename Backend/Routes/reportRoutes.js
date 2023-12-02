const express = require('express');
const router = express.Router();
const Ratings = require('../Models/RatingModel');
const User = require('../UserModel');
const Ticket = require('../TicketModel');

//Create get request to retrieve ratings for the admin
router.get('/ratings', async (req, res) => {
    try {
        const { userId } = req.body;
  
 // 1-Find the user by username
      const user = await User.findUser(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
 // 2-Make sure that the the user's role is admin
      if (user.role === 'admin') {
 // 3-If true then retrieve the attributes of the ratings table
 // --> contains the attributes tickets.schema for the additional wanted attributes 
        const ratings = await Ratings.find();
  
 // 4-Send the ratings as a response
        return res.status(200).json({ ratings });
      } else {
        return res.status(403).json({ message: 'Access Denied. User is not an admin.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
