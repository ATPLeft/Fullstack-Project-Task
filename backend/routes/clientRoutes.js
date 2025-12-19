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

        // Validation
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

        // Crop and save image (400x400 for client profile)
        let imagePath;
        try {
            // Create folder if it doesn't exist
            const fs = require('fs');
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }

            const filepath = path.join(folder, filename);
            
            // Crop image to 400x400 (square for profile)
            await require('sharp')(req.file.buffer)
                .resize(400, 400, {
                    fit: 'cover',
                    position: 'center'
                })
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(filepath);

            imagePath = `/uploads/clients/${filename}`;
        } catch (imageError) {
            return res.status(500).json({
                success: false,
                message: 'Error processing image',
                error: imageError.message
            });
        }

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

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private (for admin)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description, designation } = req.body;
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        let updateData = { name, description, designation };
        
        // If new image is uploaded
        if (req.file) {
            // Delete old image
            if (client.image) {
                const fs = require('fs');
                const oldImagePath = path.join(__dirname, '..', client.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Generate filename for new image
            const filename = `client-${Date.now()}.jpeg`;
            const folder = path.join(__dirname, '../uploads/clients');

            // Create folder if it doesn't exist
            const fs = require('fs');
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }

            const filepath = path.join(folder, filename);
            
            // Crop and save new image
            await require('sharp')(req.file.buffer)
                .resize(400, 400, {
                    fit: 'cover',
                    position: 'center'
                })
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(filepath);

            updateData.image = `/uploads/clients/${filename}`;
        }

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Client updated successfully',
            data: updatedClient
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating client',
            error: error.message
        });
    }
});

module.exports = router;