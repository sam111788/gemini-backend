// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic route to check server
app.get('/', (req, res) => {
  res.send('Welcome to the Gaposa backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Gaposa backend is running on http://localhost:${PORT}`);
});
