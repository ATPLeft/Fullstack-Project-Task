const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const validator = require('validator');

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

        // Validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        // Email validation
        if (!validator.isEmail(email)) {
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

        // Log the subscription (optional)
        console.log(`New newsletter subscriber: ${emailLower}`);

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
        console.error('Subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing subscription',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

// @desc    Check subscription status
// @route   GET /api/subscribers/check/:email
// @access  Public
router.get('/check/:email', async (req, res) => {
    try {
        const email = req.params.email.toLowerCase().trim();
        
        const subscriber = await Subscriber.findOne({ email });

        res.json({
            success: true,
            data: {
                isSubscribed: !!subscriber,
                subscribedAt: subscriber?.subscribedAt
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

// @desc    Get subscription statistics
// @route   GET /api/subscribers/stats/summary
// @access  Private (for admin)
router.get('/stats/summary', async (req, res) => {
    try {
        const totalSubscribers = await Subscriber.countDocuments();
        
        // Subscribers from last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentSubscribers = await Subscriber.countDocuments({
            subscribedAt: { $gte: thirtyDaysAgo }
        });

        // Growth rate (compared to previous 30 days)
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        const previousPeriodCount = await Subscriber.countDocuments({
            subscribedAt: { 
                $gte: sixtyDaysAgo,
                $lt: thirtyDaysAgo 
            }
        });

        const growthRate = previousPeriodCount > 0 
            ? ((recentSubscribers - previousPeriodCount) / previousPeriodCount * 100).toFixed(2)
            : recentSubscribers > 0 ? 100 : 0;

        res.json({
            success: true,
            data: {
                totalSubscribers,
                recentSubscribers,
                growthRate: `${growthRate}%`,
                averagePerDay: (recentSubscribers / 30).toFixed(1)
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

// @desc    Batch subscribe (for admin - optional)
// @route   POST /api/subscribers/batch
// @access  Private (for admin)
router.post('/batch', async (req, res) => {
    try {
        const { emails } = req.body;

        if (!Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of email addresses'
            });
        }

        const validEmails = emails
            .map(email => email.toLowerCase().trim())
            .filter(email => validator.isEmail(email));

        if (validEmails.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid email addresses provided'
            });
        }

        const existingSubscribers = await Subscriber.find({ 
            email: { $in: validEmails } 
        });

        const existingEmails = existingSubscribers.map(s => s.email);
        const newEmails = validEmails.filter(email => !existingEmails.includes(email));

        if (newEmails.length === 0) {
            return res.json({
                success: true,
                message: 'All emails are already subscribed',
                data: { added: 0, skipped: validEmails.length }
            });
        }

        // Bulk insert new subscribers
        const subscribersToAdd = newEmails.map(email => ({ email }));
        const result = await Subscriber.insertMany(subscribersToAdd);

        res.status(201).json({
            success: true,
            message: `Added ${result.length} new subscribers`,
            data: {
                added: result.length,
                skipped: validEmails.length - result.length,
                total: await Subscriber.countDocuments()
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing batch subscription',
            error: error.message
        });
    }
});

module.exports = router;