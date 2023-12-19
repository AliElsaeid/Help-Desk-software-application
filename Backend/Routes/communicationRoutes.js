const express = require('express');
const router = express.Router();
const Room = require('../Models/RoomsModel');
const ChatMessage = require('../Models/ChatMessagesModel');
const nodemailer = require('nodemailer');
const User = require('../Models/UserModel');
const { v4: uuidv4 } = require('uuid');

const Tickets = require('../Models/TicketsModel');
var crypto = require('crypto');
var cypherKey = "mySecretKey";



const authorize  = require('../Middleware/authorizationMiddleware');
const authenticationMiddleware = require('../Middleware/authenticationMiddleware');





router.post('/createRoom', authenticationMiddleware,authorize('user'),async (req, res) => {
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
      ticket: ticket_id,
    });

    const savedRoom = await newRoom.save();

    res.status(201).json(savedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  



  router.get('/getChatRooms', authenticationMiddleware,async (req, res) => {
    try {
      const { userId } = req.body;
    
  
     
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      const userRole = user.role 
  
      console.log({userRole});
      let chatRooms;
      if (userRole === 'admin') {
        
        chatRooms = await Room.find();
      } else if (userRole === 'agent') {
        const existingTicket = await Tickets.find({'agent': userId})
       const ticket_id=existingTicket._id
        chatRooms = await Room.find({ 'ticket': ticket_id });
      } else {
        const existingTicket = await Tickets.find({'user': userId})
        console.log({existingTicket});
       
       
    
        chatRooms = await Room.find({ 'ticket': existingTicket});
        
      }
  
      res.status(200).json(chatRooms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


 


  const key = 'password';
  function encrypt(text, key) {
    const cipher = crypto.createCipher('aes256', key);
    let encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
  }
  
  // Decryption function
  function decrypt(text, key) {
    const decipher = crypto.createDecipher('aes256', key);
    let decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
  }
  

  router.post('/sendMessage', authenticationMiddleware,async (req, res) => {
    try {
     
      const { roomID,userId, content } = req.body;
      
      
      


      const encryptedContent = encrypt(content, key);

  
      const newChatMessage = new ChatMessage({
        room: roomID,
        sender: userId,
        content:encryptedContent,
      });
  

  
      const savedMessage = await newChatMessage.save();
  
      await Room.findByIdAndUpdate(
        roomID,
        { $push: { messages: savedMessage._id } },
        { new: true }
      );
  
      res.status(201).json(savedMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  router.get('/getChatMessages', authenticationMiddleware,async (req, res) => {
    try {
      const { roomID } = req.body;


      const chatMessages = await ChatMessage.find({ 'room': roomID });
      
      const decryptedMessages = chatMessages.map(message => ({
        ...message._doc,
        content: decrypt(message.content, key),
      }));

  
  
      res.status(200).json(decryptedMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host:"stmp.gmail.com",
    port:587,
    secure:false,


    auth: {
      user: 'uni.help.desk23@gmail.com',
      pass: 'eoaf iwuh zmvi wccr',
    },
  });
  
  router.post('/sendEmail',authenticationMiddleware,authorize(['admin', 'agent']),async (req, res) => {
    try {
      const { userId, subject, message } = req.body;
  
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const mailOptions = {
        from: {
          name:"Uni Help_Desk",
         address: 'uni.help.desk23@gmail.com'
      }, 
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