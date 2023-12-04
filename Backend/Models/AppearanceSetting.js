const mongoose = require('mongoose');

const appearanceSchema = new mongoose.Schema({
    backgroundColor: {
        type: String,
        default: '#FFFFFF', // Default background color (you can change this)
    },
    textColor: {
        type: String,
        default: '#000000', // Default text color (you can change this)
    },
});

const AppearanceSetting = mongoose.model('AppearanceSetting', appearanceSchema);

module.exports = AppearanceSetting;
