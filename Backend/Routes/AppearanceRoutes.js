const express = require('express');
const router = express.Router();
const AppearanceSetting = require('../Models/AppearanceSetting'); // Adjust the path based on your project structure
const authorize  = require('../Middleware/authorizationMiddleware');

// API endpoint for updating appearance settings
// Inside the /api/v1/appearance route
router.put('/appearance', authorize('admin'), async (req, res) => {
    try {
        let appearanceSettings = await AppearanceSetting.findOne();
        if (!appearanceSettings) {
            appearanceSettings = new AppearanceSetting();
        }

        appearanceSettings.textColor = req.body.textColor || appearanceSettings.textColor;
        appearanceSettings.textStyle = req.body.textStyle || appearanceSettings.textStyle;

        await appearanceSettings.save();


        res.status(200).json({ message: 'Appearance settings updated successfully' });
    } catch (error) {
        console.error('Error updating appearance settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// API endpoint for retrieving current appearance settings
router.get('/appearance',authorize('admin'), async (req, res) => {
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
