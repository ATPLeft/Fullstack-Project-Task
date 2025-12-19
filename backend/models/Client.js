const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Client description is required']
    },
    designation: {
        type: String,
        required: [true, 'Client designation is required'],
        default: 'CEO'
    },
    image: {
        type: String,
        required: [true, 'Client image is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Client', clientSchema);