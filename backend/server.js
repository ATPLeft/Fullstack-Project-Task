const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directories
const uploadsDir = path.join(__dirname, 'uploads');
const projectsDir = path.join(uploadsDir, 'projects');
const clientsDir = path.join(uploadsDir, 'clients');

[uploadsDir, projectsDir, clientsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://your-frontend-domain.vercel.app'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/subscribers', require('./routes/subscriberRoutes'));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: 'Connected',
        environment: process.env.NODE_ENV
    });
});

// API documentation
app.get('/api-docs', (req, res) => {
    res.json({
        message: 'DigitalSolutions API Documentation',
        version: '1.0.0',
        endpoints: {
            projects: {
                GET: '/api/projects',
                POST: '/api/projects (form-data with image)',
                DELETE: '/api/projects/:id'
            },
            clients: {
                GET: '/api/clients',
                POST: '/api/clients (form-data with image)',
                DELETE: '/api/clients/:id'
            },
            contacts: {
                GET: '/api/contacts',
                POST: '/api/contacts (supports both contact & quote forms)',
                DELETE: '/api/contacts/:id'
            },
            subscribers: {
                GET: '/api/subscribers',
                POST: '/api/subscribers',
                DELETE: '/api/subscribers/:email'
            }
        }
    });
});

// Welcome route
app.get('/', (req, res) => {
    res.json({ 
        message: 'DigitalSolutions Backend API is running!',
        version: '1.0.0',
        documentation: '/api-docs',
        health_check: '/health'
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }
    
    if (err.name === 'MulterError') {
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message
        });
    }
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('DIGITALSOLUTIONS BACKEND API');
    console.log('='.repeat(50));
    console.log(`Server running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
    console.log(`MongoDB: ${process.env.MONGODB_URI ? 'Atlas' : 'Local'}`);
    console.log('Available Endpoints:');
    console.log(`   GET  /              - Welcome`);
    console.log(`   GET  /health        - Health Check`);
    console.log(`   GET  /api-docs      - API Documentation`);
    console.log(`   GET  /api/projects  - Get all projects`);
    console.log(`   POST /api/projects  - Add project (with image)`);
    console.log(`   GET  /api/clients   - Get all clients`);
    console.log(`   POST /api/clients   - Add client (with image)`);
    console.log(`   POST /api/contacts  - Submit contact/quote form`);
    console.log(`   POST /api/subscribers - Subscribe to newsletter`);
    console.log('='.repeat(50));
});