const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { upload, cropAndSaveImage } = require('../utils/imageUpload');
const path = require('path');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (for admin)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, category, location } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name and description'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        // Generate filename
        const filename = `project-${Date.now()}.jpeg`;
        const folder = path.join(__dirname, '../uploads/projects');

        // Crop and save image (450x350 as per requirements)
        const imagePath = `${req.protocol}://${req.get('host')}${imagePath}`;await cropAndSaveImage(req.file.buffer, folder, filename, 450, 350);

        // Create project
        const project = await Project.create({
            name,
            description,
            image: imagePath,
            category: category || 'Consultation',
            location: location || 'Location'
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating project',
            error: error.message
        });
    }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (for admin)
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Delete image file
        if (project.image) {
            const fs = require('fs');
            const imagePath = path.join(__dirname, '..', project.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await project.deleteOne();

        res.json({
            success: true,
            message: 'Project deleted successfully'
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