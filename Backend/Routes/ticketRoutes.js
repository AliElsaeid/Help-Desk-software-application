const express = require('express');
const router = express.Router();

const Ticket = require('../Models/TicketsModel');
const User = require('../Models/UserModel');

const authorize  = require('../Middleware/authorizationMiddleware');
const authenticationMiddleware = require('../Middleware/authenticationMiddleware');

const axios = require('axios');
const fetchDataFromFastAPI = async (ticketId) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/predict_assignment', {
      ticket_id: ticketId,
    });

    const predictionResult = response.data;
    console.log('Prediction Result:', predictionResult);
  } catch (error) {
    console.error('Error fetching data from FastAPI:', error.message);
  }
};






router.post('/create',authenticationMiddleware, async (req, res) => {
  try {
    const { userId, category,priority, subCategory ,description} = req.body;

    const validCategories = ['hardware', 'software', 'network'];
    const validSubCategories = {
      Hardware: ['Desktops', 'Laptops', 'Printers', 'Servers', 'Networking equipment'],
      Software: ['Operating system', 'Application software', 'Custom software', 'Integration issues'],
      Network: ['Email issues', 'Internet connection problems', 'Website errors'],
    };



   

   

    
    const newTicket = new Ticket({
      user: userId,
      category,
      subCategory,
      priority:priority,
      description,
      status:"open",
      createdAt: new Date(),
    });





    await User.findByIdAndUpdate(userId, { $push: { tickets: newTicket._id } });
    await newTicket.save();

   fetchDataFromFastAPI(newTicket._id);


    return res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Ticket by Support Agent
router.put('/:id', authenticationMiddleware,authorize(['agent','admin']),async (req, res) => {
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

// Get Ticket by ID

router.get('/getTickets',authenticationMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;


    // Check if the user making the request exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRole = user.role;
    console.log(userRole);

    let result;

    if (userRole === 'admin') {
      // Admin has access to all tickets
      result = await Ticket.find(); // Corrected from Issues.find() to Ticket.find()
    } else if (userRole === 'agent') {
      // Agent has access to tickets assigned to them
      result = await Ticket.find({ 'agent': userId });
    } else {
      // Customer has access to their own tickets
      result = await Ticket.find({ user: userId });
    }

    if (!result || result.length === 0) {
      return res.status(403).json({ error: 'Unauthorized. You do not have access to any tickets.' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});


// Get Ticket by ID
router.get('/:id',authenticationMiddleware, async (req, res) => {
  try {
  

    let result;


    result = await Ticket.find({ _id: req.params.id});
  

    if (!result || result.length === 0) {
      return res.status(403).json({ error: 'Unauthorized. You do not have access to this ticket.' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting ticket:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});







// Delete Ticket
router.delete('/:id',authenticationMiddleware,authorize(['admin']), async (req, res) => {
  try {
    const ticketId = req.params.id;

    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Remove the ticket ID from the user's tickets array
    await User.findByIdAndUpdate(ticket.user, { $pull: { tickets: ticketId } });

    // Delete the ticket
    await Ticket.findByIdAndDelete(ticketId);

    return res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});







// ... (other routes)

module.exports = router;
