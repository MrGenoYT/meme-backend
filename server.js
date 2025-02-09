const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({  
  origin: 'https://meme-frontend.onrender.com',  
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '10mb' })); // Increase JSON limit to handle images

const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Store IP logs
let ipLogs = [];

// Route to handle image upload (Base64)
app.post('/upload', (req, res) => {
  if (!req.body.photo) {
    return res.status(400).json({ message: 'No photo provided' });
  }

  const base64Data = req.body.photo.replace(/^data:image\/png;base64,/, "");
  const filename = `${Date.now()}.png`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to save image' });
    }
    res.json({ message: 'File uploaded successfully', url: `/uploads/${filename}` });
  });
});

// Route to fetch stored images
app.get('/photos', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read directory' });
    }

    const photos = files.map(file => ({
      url: `/uploads/${file}`,
      timestamp: new Date(parseInt(file.split('.')[0])).toLocaleString()
    }));

    res.json(photos);
  });
});

// Route to log IPs
app.post('/logIP', (req, res) => {
  if (!req.body.ip) {
    return res.status(400).json({ message: 'No IP provided' });
  }

  const ipLog = { ip: req.body.ip, timestamp: new Date().toLocaleString() };
  ipLogs.push(ipLog);
  res.json({ message: 'IP logged successfully' });
});

// Route to fetch IP logs
app.get('/ips', (req, res) => {
  res.json(ipLogs);
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
