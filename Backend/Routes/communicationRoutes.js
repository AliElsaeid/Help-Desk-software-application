const express = require('express');
const router = express.Router();
const Room = require('../Models/RoomsModel');
const ChatMessage = require('../Models/ChatMessagesModel');
const nodemailer = require('nodemailer');
const User = require('../Models/UserModel');
const { v4: uuidv4 } = require('uuid');

const Tickets = require('../Models/TicketsModel');




router.post('/createRoom', async (req, res) => {
  try {
    const { ticket_id } = req.body;

    if (!ticket_id) {
      return res.status(400).json({ error: 'Missing ticket_id in the request body' });
    }


    const existingTicket = await Tickets.findById(ticket_id);

    if (!existingTicket) {
      return res.status(400).json({ error: 'Invalid ticket_id' });
    }

    const newRoom = new Room({
    
      roomName: 'Real-Time Chat',
      description: existingTicket.description,
      ticket: existingTicket,
    });

    const savedRoom = await newRoom.save();

    res.status(201).json(savedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  
 
  router.get('/getChatRooms', async (req, res) => {
    try {
      const { userId } = req.body;
  
     
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      const userRole = user.role ? user.role.roleName : 'user';
  
   
      let chatRooms;
      if (userRole === 'admin') {
        
        chatRooms = await Room.find();
      } else if (userRole === 'agent') {
        
        chatRooms = await Room.find({ 'ticket.agent._id': userId });
      } else {
      
        chatRooms = await Room.find({ 'ticket.user._id': userId });
      }
  
      res.status(200).json(chatRooms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




  

  router.post('/sendMessage', async (req, res) => {
    try {
      const { roomID, senderID, content } = req.body;
     //const user = await User.findById(senderID);
     // const rooms= await Room.findById(roomID);
      //if (!user) {
        //return res.status(400).json({ error: 'Invalid user' });
      // //}
      // if (!rooms) {
      //   return res.status(400).json({ error: 'Invalid room' });
      // }

     

      const newChatMessage = new ChatMessage({
        
        room: roomID, 
        sender_id:senderID , 
        content,
       
      });
      const savedMessage = await newChatMessage.save();
      res.status(201).json(savedMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/getChatMessages', async (req, res) => {
    try {
      const chatMessages = await ChatMessage.find().populate('');
      res.status(200).json(chatMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'uni.help.desk23@gmail.com', 
      pass: 'Giu123uni45',
    },
  });
  
  router.post('/sendEmail', async (req, res) => {
    try {
      const { userId, subject, message } = req.body;
  
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const mailOptions = {
        from: 'uni.help.desk23@gmail.com', 
        to: user.email,
        subject,
        text: message,
      };
  
      
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ success: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;