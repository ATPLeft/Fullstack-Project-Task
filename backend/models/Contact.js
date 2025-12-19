const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['contact_form', 'quote_request'],
        default: 'contact_form'
    },
    projectType: {
        type: String,
        trim: true
    },
    budget: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', contactSchema);