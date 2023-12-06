const express = require('express');
const router = express.Router();

const Ticket = require('../Models/TicketsModel');
const User = require('../Models/UserModel');


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






router.post('/create', async (req, res) => {
  try {
    const { userId, category, subCategory ,description} = req.body;

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
      priority:"high",
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

module.exports = router;
