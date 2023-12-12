const express = require('express');
const router = express.Router();
const Ratings = require('../models/Ratings');
const Tickets = require('../models/Tickets');
const authorize  = require('../Middleware/authorizationMiddleware');
const authenticationMiddleware = require('../Middleware/authenticationMiddleware');
const User = require('../Models/UserModel');

router.post('/createRating',authenticationMiddleware,authorize('user') ,async (req, res) => {
  try {
    const { ticket_id, rating, comment } = req.body;

    if (!ticket_id || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields in the request body' });
    }

    // Check if the ticket exists
    const existingTicket = await Tickets.findById(ticket_id);

    if (!existingTicket) {
      return res.status(400).json({ error: 'Invalid ticket_id' });
    }

    // Check if the ticket status is closed
    if (existingTicket.status !== 'closed') {
      return res.status(400).json({ error: 'Cannot rate an open ticket. Ticket must be closed.' });
    }

    // Create a new rating
    const newRating = new Ratings({
      ticket: {
        ticket_id: existingTicket._id,
        category: existingTicket.category,
        subCategory: existingTicket.subCategory,
        priority: existingTicket.priority,
        status: existingTicket.status,
        agent: existingTicket.agent,
        description: existingTicket.description,
        resolution: existingTicket.resolution,
        createdAt: existingTicket.createdAt,
        updatedAt: existingTicket.updatedAt,
        closedAt: existingTicket.closedAt,
        ratings: existingTicket.ratings,
      },
      rating,
      comment, // Include the user-provided comment
    });

    // Save the new rating
    await newRating.save();

    res.status(201).json({ message: 'Rating created successfully', rating: newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
