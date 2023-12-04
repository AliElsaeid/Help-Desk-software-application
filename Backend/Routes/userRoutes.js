// usersRoutes.js
const express = require("express");
const router = express.Router();
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
const userModel = require("../Models/UserModel");
const sessionsModel = require("../Models/SessionsModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(405).json({ message: "Incorrect password" });
        }

        const currentDateTime = new Date();
        const expiresAt = new Date(+currentDateTime + 3 * 60 * 60 * 1000); // expire in 3 hours

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            secretKey,
            { expiresIn: 3 * 60 * 60 } // in seconds
        );

        // Save session
        const newSession = new sessionsModel({
            user: user._id, // Change to user._id
            token,
            expiryTime: expiresAt,
        });
        await newSession.save();

        // Set token in the response cookie
        return res
            .cookie("token", token, {
                expires: expiresAt,
                withCredentials: true,
                httpOnly: false,
                sameSite: 'none',
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
router.get("/", authorizationMiddleware(['admin']), async (req, res) => {
    try {
        const users = await userModel.find();
        return res.status(200).json(users);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
});

// * Get one user
router.get("/:id", authorizationMiddleware('admin'), async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// * Update one user
router.put("/:id", authorizationMiddleware(['user','admin']), async (req, res) => {
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
//update user role
router.put("/role/:id", authorizationMiddleware(['admin']), async (req, res) => {
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
router.delete("/:id", authorizationMiddleware(['admin','user']), async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ user, msg: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



module.exports = router;
