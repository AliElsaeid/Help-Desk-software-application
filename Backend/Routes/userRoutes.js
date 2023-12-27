// usersRoutes.js
const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const authorize  = require('../Middleware/authorizationMiddleware');
const authenticationMiddleware = require('../Middleware/authenticationMiddleware');

const userModel = require("../Models/UserModel");
const sessionsModel = require("../Models/SessionsModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");


router.post("/login", async (req, res) => {
    // console.log(req.body);
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "Email not found" });

            
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const currentDateTime = new Date();
        const expiresAt = new Date(+currentDateTime + 3 * 60 * 60 * 1000); // expire in 3 hours

        // Generate a JWT token
        const token = jwt.sign(
            { user: { userId: user._id, role: user.role } },
            secretKey,
            {
              expiresIn: 3 * 60 * 60,
            }
          );

        // console.log(token);
        

        // Save session
        const newSession = new sessionsModel({
            user: user._id,
            token,
            expiryTime: expiresAt,
        });
        await newSession.save();
        // console.log("lol");
        // Set token in the response cookie
        return res
            .cookie("token", token, {
                expires: expiresAt,
                withCredentials: true,
                httpOnly: false,
                // secure: true,
                // sameSite: 'none', 
            })
            .status(200)
            .json({ message: "Login successful", user });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// * register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        const existingUser = await userModel.findOne({email});
      
        

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            email,
            password: hashedPassword,
            username,
            firstName,
            lastName,
            role:"user"
            
        });
     

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// * Get all users
router.get("/", authenticationMiddleware, async (req, res) => {
    try {
        const users = await userModel.find();
        return res.status(200).json(users);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
});

// * Get one user
router.get("/:id" , async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// * Update one user
router.put("/:id",async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            },
            {
                new: true,
            }
        );
        return res.status(200).json({ user, msg: "User updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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
  let resetCode = Math.floor(1000 + Math.random() * 9000);
  let newpassword = Math.floor(1000 + Math.random() * 900000)+"";
console.log(newpassword);
router.post('/resetPassword', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
  
      const mailOptions = {
        from: {
          name:"Uni Help_Desk",
         address: 'uni.help.desk23@gmail.com'
      }, 
        to: user.email,
        subject :"Reseting Password Code",
        text: `Your verification code is: ${resetCode} Your passsword: ${newpassword}`,
      };
      await transporter.sendMail(mailOptions);
        
      res.status(200).json({ success: 'Reset code sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  console.log(resetCode);
  
  router.post('/verifyResetCode', async (req, res) => {
    try {
        const { email, resetingCode} = req.body;
    
        // Find the user by email
        console.log(newpassword);
        const user = await userModel.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ error: 'User not found or invalid reset code' });
        }
    
        if (resetingCode !== resetCode) {
          return res.status(400).json({ error: 'Invalid reset code' });
        }
      
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        console.log(hashedPassword);
        // Set the new hashed password
        user.password = hashedPassword;
    
        // Save the user with the new password and clear the reset code
        const newUser = await user.save();
    
        
    
        res.status(200).json({ newUser, success: 'Password reset successfully' });
        resetCode = undefined;
        resetCode = Math.floor(1000 + Math.random() * 9000);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
//update user role
router.put("/role/:id", async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            {
                role :req.body.role
            },
            {
                new: true,
            }
        );
        return res.status(200).json({ user, msg: "User role  updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// * Delete one user
router.delete("/:id", authorize(['admin','user']), async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ user, msg: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



module.exports = router;
