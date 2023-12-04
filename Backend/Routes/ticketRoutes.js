const express = require('express');
const router = express.Router();
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
const Ticket = require('../Models/TicketsModel');
const User = require('../Models/UserModel');

// Function to calculate priority based on category and subCategory
function calculatePriority(category, subCategory) {
  // Priority order: Hardware > Software > Network
  if (category === 'Hardware') {
    return 1;
  } else if (category === 'Software') {
    return 2;
  } else if (category === 'Network') {
    return 3;
  } else {
    return 2; // Default priority for other categories
  }
}

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
      priority: calculatePriority(category, subCategory),
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

// Update Ticket by Support Agent
router.put('/:id', async (req, res) => {
  try {
    const { status, resolution } = req.body;

    // Check if status is valid
    const validStatuses = ['Pending', 'InProgress', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the ticket by ID
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if the user making the request is a support agent
    const user = await User.findById(ticket.user); // Assuming userId is included in the request, adjust it based on your actual setup

    if (user.role === 'user') {
      return res.status(403).json({ message: 'Unauthorized. Only support agents can update tickets.' });
    }

    ticket.status = status;
    ticket.resolution = resolution;
    ticket.updatedAt = new Date();

    if (status === 'Closed') {
      ticket.closedAt = new Date();
    }

    await ticket.save();

    return res.status(200).json({ ticket, message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ... (other routes)

module.exports = router;
