
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Set up CORS to allow frontend to communicate with backend
app.use(cors({
  origin: 'https://meme-frontend.onrender.com', // Frontend URL (make sure it's correct)
  methods: ['GET', 'POST'],
}));

// Set up storage for images using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);  // Save in uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Save with unique filename
  },
});

const upload = multer({ storage: storage });

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files in the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to handle image upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ message: 'File uploaded successfully', file: req.file });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

// Sample route for fetching memes (this can be extended to fetch from Reddit or other sources)
app.get('/getMemes', (req, res) => {
  // Example: Return an array of meme URLs
  res.json([
    { meme: 'https://random.image.meme/1.jpg' },
    { meme: 'https://random.image.meme/2.jpg' },
  ]);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});