const express = require('express');
const router = express.Router();
const Ratings = require('../Models/RatingModel');
const User = require('../Models/UserModel');
const Tickets = require('../Models/TicketsModel');



router.post('/createRating' ,async (req, res) => {
    try {
      const userId  = req.user.userId;
      const { ticket_id, rating, comment } = req.body;
  
      if (!ticket_id || !rating || !comment) {
        return res.status(400).json({ error: 'Missing required fields in the request body' });
      }
  
      // Check if the ticket exists
      const existingTicket = await Tickets.findById(ticket_id);

      const agentss = await User.findById(existingTicket.agent);
     
  
     
  
      // Create a new rating
      const newRating = new Ratings({
        user:userId,
        ticket:ticket_id,
        agent:agentss.username,
        rating,
        comment, 
      });
  
      await User.findByIdAndUpdate(userId, { $push: { ratings: newRating._id } });

            await newRating.save();




  
      res.status(201).json({ message: 'Rating created successfully', rating: newRating });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/ratings', async (req, res) => {
    try {
        const userId  = req.user.userId;
  
      const user = await User.findById(userId );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
 // 2-Make sure that the the user's role is admin
      if (user.role === 'user'||user.role === 'admin') {

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
    router.get('/checkTicketRating/:ticketId', async (req, res) => {
      try {
        const ticketId = req.params.ticketId;
    
        const existingTicket = await Tickets.findById(ticketId);
    
        if (!existingTicket) {
          return res.status(404).json({ message: 'Ticket not found' });
        }
    
        const userRating = await Ratings.findOne(ticketId);
    
        if (userRating) {
          return res.status(200).json({ rated: true });
        } else {
          return res.status(200).json({ rated: false });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  module.exports = router;
