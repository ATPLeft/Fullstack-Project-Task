const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required']
    },
    image: {
        type: String,
        required: [true, 'Project image is required']
    },
    category: {
        type: String,
        default: 'Consultation',
        enum: ['Consultation', 'Design', 'Marketing & Design', 'Consultation & Marketing', 'Web Development', 'Mobile App', 'E-commerce', 'SaaS']
    },
    location: {
        type: String,
        default: 'Location'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);