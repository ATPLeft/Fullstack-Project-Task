const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Function to crop and save image (450x350 as per requirements)
const cropAndSaveImage = async (buffer, folder, filename) => {
    try {
        // Create folder if it doesn't exist
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        const filepath = path.join(folder, filename);
        
        // Crop image to 450x350 (cover mode)
        await sharp(buffer)
            .resize(450, 350, {
                fit: 'cover',
                position: 'center'
            })
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(filepath);

        return `/uploads/${path.basename(folder)}/${filename}`;
    } catch (error) {
        throw new Error('Error processing image: ' + error.message);
    }
};

module.exports = {
    upload,
    cropAndSaveImage
};