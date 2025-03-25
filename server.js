const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML pages correctly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/login.html'));
});

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/signup.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/dashboard.html'));
  });

// Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
