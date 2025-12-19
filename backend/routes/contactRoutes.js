const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

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

// @desc    Submit contact form (supports both regular contact and quote requests)
// @route   POST /api/contacts
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, mobile, city, type, projectType, budget, description } = req.body;

        console.log('Received form data:', req.body);

        // BASIC VALIDATION - accept both contact and quote forms
        if (type === 'quote_request') {
            // Quote request validation
            if (!name || !email || !projectType || !budget || !description) {
                return res.status(400).json({
                    success: false,
                    message: 'For quote requests, please provide: name, email, projectType, budget, and description'
                });
            }
        } else {
            // Regular contact form validation
            if (!name || !email || !mobile || !city) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all fields: name, email, mobile, and city'
                });
            }

            // Basic mobile validation
            const mobileDigits = mobile.replace(/\D/g, '');
            if (mobileDigits.length < 10) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid mobile number (at least 10 digits)'
                });
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Create contact submission
        const contactData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            type: type || 'contact_form',
            ...(type === 'quote_request' ? {
                projectType: projectType.trim(),
                budget: budget.trim(),
                description: description.trim(),
                mobile: 'N/A',
                city: 'N/A'
            } : {
                mobile: mobile.replace(/\D/g, '').substring(0, 15),
                city: city.trim(),
                projectType: '',
                budget: '',
                description: ''
            })
        };

        const contact = await Contact.create(contactData);

        res.status(201).json({
            success: true,
            message: type === 'quote_request' 
                ? 'Thank you! Your quote request has been submitted successfully.'
                : 'Thank you! Your contact form has been submitted successfully.',
            data: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                type: contact.type,
                submittedAt: contact.submittedAt
            }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting form',
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

module.exports = router;