const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const validator = require('validator');

// @desc    Get all contact form submissions
// @route   GET /api/contacts
// @access  Private (for admin)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ submittedAt: -1 });
        
        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, mobile, city } = req.body;

        // Validation
        if (!name || !email || !mobile || !city) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all fields: name, email, mobile, and city'
            });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Mobile validation (basic Indian format)
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit mobile number'
            });
        }

        // Check if contact already exists with same email and mobile (optional)
        const existingContact = await Contact.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { mobile: mobile.replace(/\D/g, '') }
            ],
            submittedAt: { 
                $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
        });

        if (existingContact) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted a contact form recently. Please try again later.'
            });
        }

        // Create contact submission
        const contact = await Contact.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            mobile: mobile.replace(/\D/g, ''), // Store only digits
            city: city.trim()
        });

        // Log the submission (optional)
        console.log(`New contact form submitted: ${name} - ${email}`);

        res.status(201).json({
            success: true,
            message: 'Thank you! Your contact form has been submitted successfully.',
            data: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                submittedAt: contact.submittedAt
            }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting contact form',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @desc    Get single contact by ID
// @route   GET /api/contacts/:id
// @access  Private (for admin)
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @desc    Delete a contact submission
// @route   DELETE /api/contacts/:id
// @access  Private (for admin)
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        await contact.deleteOne();

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @desc    Get contact statistics
// @route   GET /api/contacts/stats/summary
// @access  Private (for admin)
router.get('/stats/summary', async (req, res) => {
    try {
        const totalContacts = await Contact.countDocuments();
        
        // Contacts from last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentContacts = await Contact.countDocuments({
            submittedAt: { $gte: sevenDaysAgo }
        });

        // Top cities
        const topCities = await Contact.aggregate([
            { $group: { 
                _id: '$city', 
                count: { $sum: 1 } 
            }},
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            success: true,
            data: {
                totalContacts,
                recentContacts,
                topCities
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

module.exports = router;