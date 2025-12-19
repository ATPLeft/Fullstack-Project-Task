const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

// Function to crop and save image with specified dimensions
const cropAndSaveImage = async (buffer, folder, filename, width = 450, height = 350) => {
    try {
        // Create folder if it doesn't exist
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        const filepath = path.join(folder, filename);
        
        // Crop image to specified dimensions (cover mode)
        await sharp(buffer)
            .resize(width, height, {
                fit: 'cover',
                position: 'center'
            })
            .toFormat('jpeg')
            .jpeg({ quality: 85 })
            .toFile(filepath);

        // Return relative path for database
        const relativePath = path.relative(path.join(__dirname, '..'), filepath);
        return `/${relativePath.replace(/\\/g, '/')}`; // Convert to forward slashes

    } catch (error) {
        throw new Error('Error processing image: ' + error.message);
    }
};

module.exports = {
    upload,
    cropAndSaveImage
};