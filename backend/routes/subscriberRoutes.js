const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// @desc    Get all newsletter subscribers
// @route   GET /api/subscribers
// @access  Private (for admin)
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        
        res.json({
            success: true,
            count: subscribers.length,
            data: subscribers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        const emailLower = email.toLowerCase().trim();

        // Check if already subscribed
        const existingSubscriber = await Subscriber.findOne({ email: emailLower });
        
        if (existingSubscriber) {
            return res.status(400).json({
                success: false,
                message: 'This email is already subscribed to our newsletter'
            });
        }

        // Create new subscriber
        const subscriber = await Subscriber.create({
            email: emailLower
        });

        res.status(201).json({
            success: true,
            message: 'Thank you for subscribing to our newsletter!',
            data: {
                id: subscriber._id,
                email: subscriber.email,
                subscribedAt: subscriber.subscribedAt
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing subscription',
            error: error.message
        });
    }
});

// @desc    Unsubscribe from newsletter
// @route   DELETE /api/subscribers/:email
// @access  Public
router.delete('/:email', async (req, res) => {
    try {
        const email = req.params.email.toLowerCase().trim();

        const subscriber = await Subscriber.findOneAndDelete({ email });

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Email not found in our subscription list'
            });
        }

        res.json({
            success: true,
            message: 'Successfully unsubscribed from newsletter'
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