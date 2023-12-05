const express = require('express');
const router = express.Router();
// const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
const Ticket = require('../Models/TicketsModel');
const User = require('../Models/UserModel');



// Create Ticket
router.post('/create', async (req, res) => {
  try {
    const { userId, category, subCategory ,description} = req.body;

    // Check if the category and subCategory are valid
    const validCategories = ['Hardware', 'Software', 'Network'];
    const validSubCategories = {
      Hardware: ['Desktops', 'Laptops', 'Printers', 'Servers', 'Networking equipment'],
      Software: ['Operating system', 'Application software', 'Custom software', 'Integration issues'],
      Network: ['Email issues', 'Internet connection problems', 'Website errors'],
    };

    if (!validCategories.includes(category) || !validSubCategories[category].includes(subCategory)) {
      return res.status(400).json({ message: 'Invalid category or subcategory' });
    }

   

    
    const newTicket = new Ticket({
      user: userId,
      category,
      subCategory,
      priority:"High",
      description,
      status:"Pending",
      createdAt: new Date(),
    });

    // Update the user's tickets array
    await User.findByIdAndUpdate(userId, { $push: { tickets: newTicket._id } });

    await newTicket.save();

    return res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});