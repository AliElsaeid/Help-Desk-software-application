const mongoose = require('mongoose');

const appearanceSchema = new mongoose.Schema({

    textColor: {
        type: String,
        default: '#000000', 
    },
    textStyle:{
        type: String,
        default: 'normal', 
    }

});

const AppearanceSetting = mongoose.model('AppearanceSetting', appearanceSchema);

module.exports = AppearanceSetting;
