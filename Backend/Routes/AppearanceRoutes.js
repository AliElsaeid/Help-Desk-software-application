const express = require('express');
const router = express.Router();
const AppearanceSetting = require('../Models/AppearanceSetting'); // Adjust the path based on your project structure
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');

// API endpoint for updating appearance settings
router.put('/appearance', authorizationMiddleware(['admin']), async (req, res) => {
    try {
        // Check if the appearance settings record exists, if not, create a new one
        let appearanceSettings = await AppearanceSetting.findOne();
        if (!appearanceSettings) {
            appearanceSettings = new AppearanceSetting();
        }

        // Update appearance settings based on the request body
        appearanceSettings.backgroundColor = req.body.backgroundColor || appearanceSettings.backgroundColor;
        appearanceSettings.textColor = req.body.textColor || appearanceSettings.textColor;

        // Save the updated appearance settings to the database
        await appearanceSettings.save();

        res.status(200).json({ message: 'Appearance settings updated successfully' });
    } catch (error) {
        console.error('Error updating appearance settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// API endpoint for retrieving current appearance settings
router.get('/appearance', authorizationMiddleware(['admin']), async (req, res) => {
    try {
        // Retrieve the appearance settings record
        const appearanceSettings = await AppearanceSetting.findOne();

        if (!appearanceSettings) {
            return res.status(404).json({ message: 'Appearance settings not found' });
        }

        res.status(200).json(appearanceSettings);
    } catch (error) {
        console.error('Error retrieving appearance settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
