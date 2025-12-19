const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { upload, cropAndSaveImage } = require('../utils/imageUpload');
const path = require('path');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: clients.length,
            data: clients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @desc    Create a client
// @route   POST /api/clients
// @access  Private (for admin)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, designation } = req.body;

        if (!name || !description || !designation) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, description and designation'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a client image'
            });
        }

        // Generate filename
        const filename = `client-${Date.now()}.jpeg`;
        const folder = path.join(__dirname, '../uploads/clients');

        // Crop and save image (400x400 for profile)
        const imagePath = `${req.protocol}://${req.get('host')}${imagePath}`;await cropAndSaveImage(req.file.buffer, folder, filename, 400, 400);

        // Create client
        const client = await Client.create({
            name,
            description,
            designation,
            image: imagePath
        });

        res.status(201).json({
            success: true,
            message: 'Client added successfully',
            data: client
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding client',
            error: error.message
        });
    }
});

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private (for admin)
router.delete('/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Delete image file
        if (client.image) {
            const fs = require('fs');
            const imagePath = path.join(__dirname, '..', client.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await client.deleteOne();

        res.json({
            success: true,
            message: 'Client deleted successfully'
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