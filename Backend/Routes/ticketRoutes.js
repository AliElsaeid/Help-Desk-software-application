const express = require('express');
const router = express.Router();

const Ticket = require('../Models/TicketsModel');
const User = require('../Models/UserModel');
const Room = require('../Models/RoomsModel');

const authorize  = require('../Middleware/authorizationMiddleware');
const authenticationMiddleware = require('../Middleware/authenticationMiddleware');
const axios = require('axios');
const fetchDataFromFastAPI = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/predict_assignment');

    const predictionResult = response.data;
    console.log('Prediction Result:', predictionResult);
  } catch (error) {
    console.error('Error fetching data from FastAPI:', error.message);
  }
};






router.post('/create', async (req, res) => {
  try {

    const userId  = req.user.userId;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {category,priority, subCategory ,description} = req.body;

    


    const validCategories = ['hardware', 'software', 'network'];
    const validSubCategories = {
      Hardware: ['Desktops', 'Laptops', 'Printers', 'Servers', 'Networking equipment'],
      Software: ['Operating system', 'Application software', 'Custom software', 'Integration issues'],
      Network: ['Email issues', 'Internet connection problems', 'Website errors'],
    };

    const newTicket = new Ticket({
      user: user._id,
      category,
      subCategory,
      priority:priority,
      description,
      status:"open",
      createdAt: new Date(),
    });





    await User.findByIdAndUpdate(userId, { $push: { tickets: newTicket._id } });
    await newTicket.save();

   fetchDataFromFastAPI();


    return res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/getTickets',async (req, res) => {
  try {
    const userId  = req.user.userId;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRole = user.role;
    console.log(userRole);

    let result;

    if (userRole === 'admin') {
      result = await Ticket.find();
    } else if (userRole === 'agent') {
   
      result = await Ticket.find({ 'agent': userId });
    } else {
      result = await Ticket.find({ user: userId });
    }


    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

router.put('/:id',async (req, res) => {
  try {
    const { status, resolution } = req.body;

    const validStatuses = ['open', 'pending', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

 
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

   

    ticket.status = status;
    ticket.resolution = resolution;
    ticket.updatedAt = new Date();

    if (status === 'Closed') {
      ticket.closedAt = new Date();
    }

    await ticket.save();
    await axios.post('http://127.0.0.1:8000/predict_assignment', {});


    return res.status(200).json({ ticket, message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
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








router.delete('/:id',authorize(['admin']), async (req, res) => {
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

module.exports = router;
