const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // For parsing application/json

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/levels', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'levels.html'));
});

app.get('/garage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'garage.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// API endpoints for settings
app.post('/api/settings', (req, res) => {
  // In a real application, you would save these settings to a database
  console.log('Settings saved:', req.body);
  res.json({ status: 'success', message: 'Settings saved successfully' });
});

// API endpoint for car customization
app.post('/api/customize', (req, res) => {
  // In a real application, you would save these customizations
  console.log('Car customized:', req.body);
  res.json({ status: 'success', message: 'Car customized successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Serene Drives server running on http://localhost:${PORT}`);
});
