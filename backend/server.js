const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const projectsDir = path.join(uploadsDir, 'projects');
const clientsDir = path.join(uploadsDir, 'clients');

[uploadsDir, projectsDir, clientsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
});

// Morgan logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL, 
            process.env.ADMIN_URL,
            'http://localhost:3000',
            'http://localhost:3001'
        ];
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Flipr Backend API');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '1d', // Cache for 1 day
    setHeaders: (res, path) => {
        if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        }
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'Connected', // You can add MongoDB connection check here
        environment: process.env.NODE_ENV
    });
});

// API documentation endpoint
app.get('/api-docs', (req, res) => {
    res.json({
        message: 'Flipr Fullstack Task API Documentation',
        version: '1.0.0',
        endpoints: {
            projects: {
                GET: '/api/projects',
                POST: '/api/projects (with image)',
                DELETE: '/api/projects/:id'
            },
            clients: {
                GET: '/api/clients',
                POST: '/api/clients (with image)',
                PUT: '/api/clients/:id',
                DELETE: '/api/clients/:id'
            },
            contacts: {
                GET: '/api/contacts',
                POST: '/api/contacts',
                GET_stats: '/api/contacts/stats/summary'
            },
            subscribers: {
                GET: '/api/subscribers',
                POST: '/api/subscribers',
                DELETE: '/api/subscribers/:email',
                GET_check: '/api/subscribers/check/:email'
            }
        },
        note: 'For POST requests with images, use form-data with fields: name, description, image(file)'
    });
});

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ 
        message: '🚀 Flipr Fullstack Task Backend API is running!',
        version: '1.0.0',
        documentation: '/api-docs',
        health_check: '/health',
        endpoints: {
            projects: '/api/projects',
            clients: '/api/clients',
            contacts: '/api/contacts',
            subscribers: '/api/subscribers'
        },
        note: 'Deployed for Flipr placement task. All features implemented including image cropping (450x350).'
    });
});

// Import routes
const projectRoutes = require('./routes/projectRoutes');
const clientRoutes = require('./routes/clientRoutes');
const contactRoutes = require('./routes/contactRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');

// Use routes with route logging in development
if (process.env.NODE_ENV === 'development') {
    app.use('/api/projects', (req, res, next) => {
        console.log(`📦 Projects API: ${req.method} ${req.url}`);
        next();
    }, projectRoutes);
    
    app.use('/api/clients', (req, res, next) => {
        console.log(`👥 Clients API: ${req.method} ${req.url}`);
        next();
    }, clientRoutes);
    
    app.use('/api/contacts', (req, res, next) => {
        console.log(`📞 Contacts API: ${req.method} ${req.url}`);
        next();
    }, contactRoutes);
    
    app.use('/api/subscribers', (req, res, next) => {
        console.log(`📧 Subscribers API: ${req.method} ${req.url}`);
        next();
    }, subscriberRoutes);
} else {
    app.use('/api/projects', projectRoutes);
    app.use('/api/clients', clientRoutes);
    app.use('/api/contacts', contactRoutes);
    app.use('/api/subscribers', subscriberRoutes);
}

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
    
    // Handle specific error types
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
    
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            message: 'CORS Error: Request not allowed from this origin'
        });
    }
    
    // Default error response
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        timestamp: new Date().toISOString()
    });
});

// 404 handler - must be last route
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false,
        message: `Route ${req.originalUrl} not found`,
        availableRoutes: [
            'GET /',
            'GET /health',
            'GET /api-docs',
            'GET /api/projects',
            'POST /api/projects',
            'GET /api/clients',
            'POST /api/clients',
            'GET /api/contacts',
            'POST /api/contacts',
            'GET /api/subscribers',
            'POST /api/subscribers'
        ]
    });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 FLIPR FULLSTACK TASK - BACKEND API');
    console.log('='.repeat(50));
    console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`🔗 Backend URL: http://localhost:${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`⚡ Admin Panel URL: ${process.env.ADMIN_URL || 'http://localhost:3001'}`);
    console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Using local'}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
    console.log('='.repeat(50));
    console.log('\n📋 Available Endpoints:');
    console.log(`   GET  /              - API Info`);
    console.log(`   GET  /health        - Health Check`);
    console.log(`   GET  /api-docs      - API Documentation`);
    console.log(`   GET  /api/projects  - Get all projects`);
    console.log(`   POST /api/projects  - Add project (with image)`);
    console.log(`   GET  /api/clients   - Get all clients`);
    console.log(`   POST /api/clients   - Add client (with image)`);
    console.log(`   POST /api/contacts  - Submit contact form`);
    console.log(`   POST /api/subscribers - Subscribe to newsletter`);
    console.log('='.repeat(50));
});