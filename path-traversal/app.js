const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Setup directories
const imagesDir = path.join(__dirname, 'images');
const configDir = path.join(__dirname, 'config');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
}

// Create placeholder images (SVG format for simplicity)
const createSVGImage = (color, name) => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${color}"/>
  <text x="50%" y="50%" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">${name}</text>
</svg>`;

fs.writeFileSync(path.join(imagesDir, 'landscape1.svg'), createSVGImage('#3498db', 'Mountain Landscape'));
fs.writeFileSync(path.join(imagesDir, 'landscape2.svg'), createSVGImage('#2ecc71', 'Forest View'));
fs.writeFileSync(path.join(imagesDir, 'portrait1.svg'), createSVGImage('#e74c3c', 'City Portrait'));
fs.writeFileSync(path.join(imagesDir, 'abstract1.svg'), createSVGImage('#9b59b6', 'Abstract Art'));

// Create sensitive config files that shouldn't be accessible
fs.writeFileSync(
    path.join(configDir, 'database.conf'),
    `[database]
host=localhost
port=5432
username=admin
password=SuperSecretDBPassword123!
database=gallery_prod

[security]
jwt_secret=my-super-secret-jwt-key-do-not-share
api_key=sk_live_51HxYz1234567890abcdef`
);

fs.writeFileSync(
    path.join(configDir, '.env'),
    `DB_PASSWORD=SuperSecretDBPassword123!
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
STRIPE_SECRET_KEY=sk_live_51HxYz1234567890abcdef
ADMIN_EMAIL=admin@gallery.com`
);

// List of available images
const availableImages = ['landscape1.svg', 'landscape2.svg', 'portrait1.svg', 'abstract1.svg'];

app.get('/', (req, res) => {
    const imageGalleryHTML = availableImages.map(img => `
        <div style="display: inline-block; margin: 20px; text-align: center;">
            <img src="/image?file=${img}" width="200" style="border: 2px solid #ddd; border-radius: 8px;"/>
            <p>${img}</p>
        </div>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Photo Gallery</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                h1 {
                    color: #333;
                    text-align: center;
                }
                .gallery {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
            </style>
        </head>
        <body>
            <h1>🖼️ My Photo Gallery</h1>
            <p style="text-align: center; color: #666;">Browse through our collection of beautiful images</p>
            <div class="gallery">
                ${imageGalleryHTML}
            </div>
        </body>
        </html>
    `);
});

// VULNERABLE ENDPOINT - Path Traversal vulnerability
// This endpoint is meant to serve images but can be exploited to read any file
app.get('/image', (req, res) => {
    const fileName = req.query.file;

    if (!fileName) {
        return res.status(400).send('Image filename is required');
    }

    console.log('DEBUG Requested image:', fileName);

    // VULNERABILITY: Direct concatenation without validation
    // This allows attackers to use ../ to traverse directories
    const imagePath = path.join(imagesDir, fileName);

    console.log('DEBUG Resolved path:', imagePath);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
        return res.status(404).send('Image not found');
    }

    // Serve the file
    try {
        const content = fs.readFileSync(imagePath);
        // Try to detect content type, default to SVG
        if (imagePath.endsWith('.svg')) {
            res.type('image/svg+xml');
        } else if (imagePath.endsWith('.png')) {
            res.type('image/png');
        } else if (imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg')) {
            res.type('image/jpeg');
        } else {
            // For exploited files, show as plain text
            res.type('text/plain');
        }
        res.send(content);
    } catch (error) {
        console.log('DEBUG Error reading file:', error.message);
        res.status(500).send('Error loading image');
    }
});

app.listen(PORT, () => {
    console.log(`DEBUG Server running on http://localhost:${PORT}`);
    console.log(`DEBUG Images directory: ${imagesDir}`);
    console.log(`DEBUG Config directory: ${configDir}`);
});
